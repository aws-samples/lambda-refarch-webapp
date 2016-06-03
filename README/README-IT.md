# Architettura di riferimento senza server: applicazioni Web

Architettura di riferimento senza server che illustra come creare applicazioni Web dinamiche utilizzando [AWS Lambda](http://aws.amazon.com/lambda/) e Amazon API Gateway per autenticare ed elaborare le richieste di API.

Grazie alla combinazione di AWS Lambda e altri servizi AWS, gli sviluppatori possono creare potenti applicazioni Web con scalabilità automatica ed eseguibili in una configurazione ad alta disponibilità su più data center, senza interventi amministrativi per scalabilità, backup o ridondanza in più data center.

Questo esempio è incentrato sull'utilizzo di AWS Lambda e Amazon API Gateway per creare un'applicazione di voto dinamica, che riceve voti tramite SMS, aggrega i totali in Amazon DynamoDB e utilizza Amazon Simple Storage Service (Amazon S3) per la visualizzazione dei risultati in tempo reale.

L'architettura descritta in questo [diagramma](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda-refarch-webapp.pdf) può essere creata con un modello di AWS CloudFormation.

[Il modello](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda_webapp.template) svolge le operazioni seguenti:

- Creazione di un bucket S3 nominato &lt;S3BucketName\> che contiene l'applicazione Web
- Creazione di una tabella di DynamoDB nominata "VoteApp" in cui vengono archiviati i voti
- Creazione di una tabella di DynamoDB nominata "VoteAppAggregates" in cui vengono aggregati i totali dei voti
- Creazione di una funzione di Lambda che consente all'applicazione di ricevere i voti
- Creazione di una funzione di Lambda che consente all'applicazione di aggregare i voti
- Creazione di un ruolo e di una policy di AWS Identity and Access Management (IAM) che consentono alle funzioni di Lambda di scrivere nei registri di Amazon CloudWatch e di scrivere ed eseguire query nelle tabelle di DynamoDB

## Pannello di controllo dinamico

I servizi e le risorse configurati dal modello di AWS CloudFormation possono essere testati con la pagina HTML "index.html", che utilizza i file HTML, JavaScript e CSS disponibili in questo repository. È possibile copiare questi file nel bucket S3 creato dallo script di AWS CloudFormation.

## Istruzioni
**Important:** Il modello di CloudFormation fornito recupera il suo codice Lambda da un bucket nella regione Stati Uniti orientali 1. Per avviare questo esempio in un'altra regione, modificare il modello e caricare il codice Lambda in un bucket di quella regione. 

Questo esempio illustra la ricezione dei voti tramite messaggio di testo da utenti che utilizzano un numero telefonico. Per duplicare il sistema creato da questa architettura, è necessario impostare un numero telefonico con terze parti, come [Twilio](http://twilio.com). Per i dettagli completi, leggere [il nostro post](https://medium.com/aws-activate-startup-blog/building-dynamic-dashboards-using-aws-lambda-and-amazon-dynamodb-streams-part-ii-b2d883bebde5) su [AWS Startup Collection at Medium](https://medium.com/aws-activate-startup-blog).

Passaggio 1: creare uno stack di AWS CloudFormation con il [modello](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda_webapp.template) e assegnargli un nome con lettere minuscole.

Passaggio 2: accedere al [pannello di controllo API Gateway](https://console.aws.amazon.com/apigateway/home) nell'account AWS personale e creare una nuova risorsa con un endpoint "/vote". Assegnare un metodo POST con "Lambda Function" di tipo "Integration Request" e indicare la funzione Lambda creata dallo script di AWS CloudFormation che riceve voti dal servizio di voto di terze parti (in questo esempio, Twilio).

In "Mapping Templates", impostare "Content-Type" su "application/x-www-form-urlencoded" e aggiungere [questo modello di mapping] (apigateway-mappingtemplate.txt).

Passaggio 3: accedere al [pannello di controllo Amazon Cognito](https://console.aws.amazon.com/cognito/home) e creare un nuovo pool di identità che consenta l'accesso a identità non autenticate. Modificare il documento della policy per consentire l'accesso per lettura alla tabella di aggregazione di DynamoDB creata dallo script di AWS CloudFormation. Ciò consente agli utenti non autenticati di recuperare i dati dalla tabella di aggregazione dei voti in DynamoDB. Amazon Cognito fornisce il codice di esempio per la piattaforma JavaScript. Prendere nota del valore per l'ID del pool di identità, necessario per il passaggio 4.

Passaggio 4: copiare i file HTML, CSS e JS da questo repository nel bucket S3 statico creato per ospitare il pannello di controllo. Sarà necessario aprire "refresh.js" e sostituire i valori predefiniti di "region" e "identity-pool-id" con i valori a disposizione.

Congratulazioni. L'esempio di architettura di riferimento è ora in funzione. È possibile ricevere voti in tempo reale, ottimizzare la tabella di DynamoDB per gestire vari livelli di traffico in entrata e visualizzare in tempo reale le variazioni dei risultati nel pannello di controllo.

## Nota

Lo script di AWS CloudFormation crea due tabelle di DynamoDB. Sebbene sia possibile specificare la capacità di lettura e scrittura attraverso lo script di AWS CloudFormation, non è possibile specificare i nomi delle tabelle nello script. Questo perché il codice JavaScript che riceve e aggrega i voti deve conoscere in anticipo i nomi di tali tabelle (_VoteApp_ and _VoteAppAggregates_). Se si desidera modificare i nomi delle tabelle di DynamoDB, tali modifiche devono essere apportate nei file JavaScript stessi nel codice che si trova sia nella [fonte di aggregazione](/lambda-functions/aggregate-votes/) che nella [fonte di ricezione](/lambda-functions/receive-vote/).

## Eliminazione

Per eliminare tutte le risorse create automaticamente, eliminare lo stack di AWS CloudFormation. È necessario eliminare manualmente l'endpoint di API Gateway e il pool di identità di Amazon Cognito.

Nota: per eliminare il bucket S3, è necessario eliminare tutti i file nel bucket prima di eliminare lo stack.

## Licenza

La licenza di questo esempio di architettura di riferimento è fornita con Apache 2.0.
