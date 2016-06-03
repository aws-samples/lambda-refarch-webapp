# Architecture de référence sans serveur : Applications web

Architecture de référence illustrant comment créer des applications web dynamiques à l'aide d'[AWS Lambda](http://aws.amazon.com/lambda/) et d'Amazon API Gateway pour authentifier et traiter des demandes d'API.

En combinant AWS Lambda avec d'autres services AWS, les développeurs peuvent créer des applications web puissantes qui sont dimensionnées automatiquement et s'exécutent dans une configuration hautement disponible dans plusieurs data centers, sans aucun effort administratif requis pour l'évolutivité, les sauvegardes ou la redondance sur plusieurs data centers.

Cet exemple illustre l'utilisation d'AWS Lambda et d'Amazon API Gateway pour créer une application de vote dynamique qui reçoit les votes via SMS, regroupe les totaux dans Amazon DynamoDB et utilise Amazon Simple Storage Service (Amazon S3) pour afficher les résultats en temps réel.

L'architecture décrite dans ce [diagramme](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda-refarch-webapp.pdf) peut être créée avec un template AWS CloudFormation.

[Le template](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda_webapp.template) exécute les opérations suivantes :

- Il crée un bucket (compartiment) S3 nommé &lt;S3BucketName\> pour contenir votre application web.
- Il crée une table DynamoDB appelée `VoteApp` pour stocker les votes
- Il crée une table DynamoDB appelée `VoteAppAggregates` pour regrouper les totaux de votes
- Il crée une fonction Lambda qui permet à votre application de recevoir les votes
- Il crée une fonction Lambda qui permet à votre application de regrouper les votes
- Il crée un rôle AWS Identity and Access Management (IAM) et une politique pour permettre aux fonctions Lambda d'écrire dans des journaux Amazon CloudWatch, et d'écrire dans les tables DynamoDB et les interroger

## Tableau de bord dynamique

Les services et ressources configurés par le template AWS CloudFormation peuvent être testés avec la page HTML `index.html`, qui repose sur les fichiers HTML, JavaScript et CSS trouvés dans ce référentiel. Vous pouvez créer ces fichiers dans le bucket (compartiment) S3 créé par le script. AWS CloudFormation.

## Instructions
**Important:** Le template CloudFormation fourni extrait son code Lambda d'un bucket dans la région us-east-1. Pour lancer cet exemple dans une autre région, veuillez modifier le template et charger le code Lambda dans un bucket de cette région. 

Cet exemple illustre la réception des votes par SMS envoyés par des utilisateurs via un numéro de téléphone. Pour dupliquer le système créé par cette architecture, vous devrez configurer un numéro de téléphone avec un service tiers, comme [Twilio](http://twilio.com). Pour plus de détails, lisez [notre billet](https://medium.com/aws-activate-startup-blog/building-dynamic-dashboards-using-aws-lambda-and-amazon-dynamodb-streams-part-ii-b2d883bebde5) sur le blog [AWS Startup Collection at Medium](https://medium.com/aws-activate-startup-blog).

Étape 1 – Créez une stack AWS CloudFormation avec le [template](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda_webapp.template) en utilisant un nom en minuscules pour la stack.

Étape 2 – Accédez au [tableau de bord API Gateway](https://console.aws.amazon.com/apigateway/home) dans votre compte AWS et créez une ressource avec un Endpoint `/vote`. Attribuez une méthode POST ayant le type `Integration Request` (demande d'intégration) de « fonction Lambda » et pointez vers la fonction Lambda créée par le script AWS CloudFormation qui reçoit les votes de votre service de vote tiers (dans cet exemple, Twilio).

Sous `Mapping Templates`, définissez "Content-Type" sur `application/x-www-form-urlencoded`, et ajoutez [ce template de mapping](apigateway-mappingtemplate.txt).

Étape 3 – Accédez au [tableau de bord Amazon Cognito](https://console.aws.amazon.com/cognito/home) et créez un pool d'identités qui autorise l'accès à des identités non authentifiées. Modifiez le document de politique pour autoriser un accès en lecture à la table DynamoDB de regroupements créée par le script AWS CloudFormation ci-dessus. Cela permet aux utilisateurs non authentifiés d'extraire des données de la table de regroupement de votes dans DynamoDB. Amazon Cognito fournira un exemple de code pour la plateforme JavaScript. Notez la valeur de l'ID de pool d'identités ; vous en aurez besoin à l'étape 4.

Étape 4 – Copiez les fichiers HTML, CSS et JS de ce référentiel vers le bucket (compartiment) S3 statique qui avait été créé pour contenir votre tableau de bord. Vous devrez ouvrir `refresh.js` et remplacer les valeurs par défaut de `region` et `identity-pool-id` par vos propres valeurs.

Félicitations ! Vous devriez désormais disposer d'un exemple opérationnel d'architecture de référence. Vous pouvez recevoir les votes en temps réel, ajuster votre table DynamoDB pour traiter différents niveaux de trafic entrant et voir vos résultats changer sur votre tableau de bord en temps réel !

## À noter

Le script AWS CloudFormation va créer deux tables DynamoDB pour vous. Si vous pouvez spécifier la capacité de lecture et d'écriture par le biais du script AWS CloudFormation, vous n'êtes pas en mesure d'indiquer les noms de table dans le script. Cela est dû au fait que le code JavaScript qui reçoit et regroupe les votes doit connaître les noms de ces tables (_VoteApp_ et _VoteAppAggregates_) à l'avance. Si vous souhaitez changer les noms de vos tables DynamoDB, veillez à modifier les noms dans les fichiers JavaScript dans le code trouvé dans [la source de regroupement](/lambda-functions/aggregate-votes/) et [la source de réception](/lambda-functions/receive-vote/).

## Nettoyage

Pour supprimer automatiquement toutes les ressources créées, supprimez la stack AWS CloudFormation. Vous devrez supprimer manuellement l'Endpoint API Gateway et le pool d'identités Amazon Cognito.

Remarque : La suppression du bucket (compartiment) S3 échouera sauf si tous les fichiers du bucket ont été supprimés avant la suppression de la stack.

## Licence

Cet exemple d'architecture de référence est fourni sous licence sous Apache 2.0.
