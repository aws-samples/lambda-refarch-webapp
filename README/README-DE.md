# Serverlose Referenzarchitektur: Webanwendungen

Die serverlose Referenzarchitektur veranschaulicht, wie dynamische Webanwendungen zur Authentifizierung und Verarbeitung von API-Anforderungen mithilfe von [AWS Lambda](http://aws.amazon.com/lambda/) und Amazon API Gateway erstellt werden.

Durch die Kombination von AWS Lamda mit anderen AWS-Services können Entwickler leistungsfähige Webanwendungen erstellen, die automatisch nach oben oder unten skalieren und in einer hochverfügbaren Konfiguration über mehrere Rechenzentren hinweg ausgeführt werden – ohne den geringsten administrativen Aufwand für die Skalierbarkeit, für Sicherungen oder die Redundanz mehrerer Rechenzentren.

In diesem Beispiel werden AWS Lambda und Amazon API Gateway zur Erstellung einer dynamischen Abstimmungsanwendung gezeigt. Die Anwendung erhält Stimmen über SMS, aggregiert die Summen in Amazon DynamoDB und verwendet Amazon Simple Storage Service (Amazon S3), um die Ergebnisse in Echtzeit anzuzeigen.

Die in diesem [Diagramm](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda-refarch-webapp.pdf) beschriebene Architektur kann mithilfe einer AWS CloudFormation-Vorlage erstellt werden.

[Die Vorlage](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda_webapp.template) führt folgende Aktionen aus:

- Erstellen eines Amazon S3-Buckets mit dem Namen &lt;S3BucketName\> für Ihre Web-App
- Erstellen einer DynamoDB-Tabelle mit dem Namen "VoteApp", um die Stimmen zu speichern
- Erstellen einer DynamoDB-Tabelle mit dem Namen "VoteAppAggregates", um die Stimmensummen zu aggregieren
- Erstellen einer Lambda-Funktion, die es Ihrer Anwendung ermöglicht, Stimmen zu empfangen
- Erstellen einer Lambda-Funktion, die es Ihrer Anwendung ermöglicht, Stimmen zu aggregieren
- Erstellen einer AWS Identity and Access Management (IAM) IAM-Rolle und -Richtlinie, um zu gestatten, dass die Lambda-Funktionen in die Amazon CloudWatch-Protokolle schreiben sowie DynamoDB-Tabellen schreiben und abfragen

## Dynamisches Dashboard

Die über die AWS CloudFormation-Vorlage konfigurierten Services und Ressourcen können mithilfe der HTML-Seite "index.html", die auf die in diesem Repository enthaltenen HTML-, JavaScript- und CSS-Dateien basiert, getestet werden. Sie können diese Dateien in den S3-Bucket kopieren, der vom AWS CloudFormation-Skript erstellt wurde.

## Anweisungen
**Wichtig:** Die bereitgestellte CloudFormation-Vorlage ruft ihren Lambda-Code aus einem Bucket für die Region "us-east-1" ab. Um dieses Beispiel in einer anderen Region zu starten, ändern Sie die Vorlage und laden Sie den Lambda-Code in einen Bucket für diese Region hoch. 

Dieses Beispiel zeigt, wie Stimmen von Benutzern aus Textnachrichten über eine Telefonnummer empfangen werden. Um das von dieser Architektur erstellte System zu duplizieren, müssen Sie eine Telefonnummer bei einem Drittanbieter einrichten, beispielsweise [Twilio](http://twilio.com). Umfassende Informationen dazu erhalten Sie in [unserem Post](https://medium.com/aws-activate-startup-blog/building-dynamic-dashboards-using-aws-lambda-and-amazon-dynamodb-streams-part-ii-b2d883bebde5) auf dem Blog ["AWS Startup Collection" bei Medium](https://medium.com/aws-activate-startup-blog).

Schritt 1 – Erstellen Sie mithilfe [der Vorlage](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda_webapp.template) einen AWS CloudFormation-Stapel und verwenden Sie Kleinbuchstaben für den Stapelnamen.

Schritt 2 – Rufen Sie in Ihrem AWS-Konto das [API Gateway-Dashboard](https://console.aws.amazon.com/apigateway/home) auf und erstellen Sie eine neue Ressource mit einem "/vote"-Endpunkt. Weisen Sie eine POST-Methode zu, die den Typ "Integration Request" der "Lambda Function" aufweist und verweisen Sie auf die vom AWS CloudFormation-Skript erstellte Lambda-Funktion, die die Stimmen von Ihrem Drittanbieter empfängt (in diesem Beispiel Twilio).

Setzen Sie unter "Mapping Templates" den "Content-Type" auf "application/x-www-form-urlencoded" und fügen Sie [diese Zuordnungsvorlage](apigateway-mappingtemplate.txt) hinzu.

Schritt 3 – Rufen Sie das [Amazon Cognito-Dashboard](https://console.aws.amazon.com/cognito/home) auf und erstellen Sie einen neuen Identitäts-Pool, der nicht authentifizierten Identitäten Zugriff gewährt. Ändern Sie das Richtliniendokument, damit Lesezugriff auf die DynamoDB-Tabelle mit den aggregierten Daten gewährt wird – dies ist die Tabelle, die vom oben genannten AWS CloudFormation-Skript erstellt wurde. Dadurch können nicht authentifizierte Benutzer Daten aus der Tabelle mit den aggregierten Stimmen in DynamoDB abrufen. Amazon Cognito liefert den Beispiel-Code für die JavaScript-Plattform. Notieren Sie die Identitäts-Pool-ID; Sie benötigen sie in Schritt 4.

Schritt 4 – Kopieren Sie die HTML-, CSS- und JS-Dateien aus diesem Repository in den statischen S3-Bucket, der für Ihr Dashboard erstellt wurde. Sie müssen "refresh.js" öffnen und die Standardwerte für "region" und "identity-pool-id" durch Ihre eigenen Werte ersetzen.

Herzlichen Glückwunsch! Sie sollten nun über ein funktionierendes Beispiel der Referenzarchitektur verfügen. Sie können Stimmen in Echtzeit empfangen, Ihre DynamoDB-Tabelle so abstimmen, dass unterschiedliches Datenverkehrsaufkommen bewältigt wird, und die Ergebnisse auf Ihrem Dashboard in Echtzeit verfolgen.

## Hinweise

Das AWS CloudFormation-Skript erstellt zwei DynamoDB-Tabellen. Obwohl die Lese- und Schreibkapazität mit dem AWS CloudFormation-Skript festgelegt werden kann, können Sie die Tabellennamen nicht im Skript angeben. Der Grund hierfür ist, dass dem JavaScript-Code, der die Stimmen empfängt und aggregiert, die Namen dieser Tabellen ("_VoteApp_" und "_VoteAppAggregates_") vorab bekannt sein müssen. Wenn Sie die Namen Ihrer DynamoDB-Tabellen ändern möchten, achten Sie darauf, die Namen in den JavaScript-Dateien selbst zu ändern, und zwar im [Quellcode für die aggregierten Daten](/lambda-functions/aggregate-votes/) wie auch im [Quellcode für den Stimmenempfang](/lambda-functions/receive-vote/).

## Bereinigung

Um alle automatisch erstellten Ressourcen zu entfernen, löschen Sie den AWS CloudFormation-Stapel. Sie müssen den API Gateway-Endpunkt und den Identitäts-Pool für Amazon Cognito manuell entfernen.

Hinweis: Das Entfernen des S3-Buckets wird fehlschlagen, wenn nicht alle Dateien im Bucket entfernt werden, bevor der Stapel gelöscht wird.

## Lizensierung

Dieses Beispiel einer Referenzarchitektur ist unter Apache 2.0 lizensiert.
