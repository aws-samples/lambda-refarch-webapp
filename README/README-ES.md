# Arquitectura de referencia sin servidor: Aplicaciones web

La arquitectura de referencia sin servidor ilustra cómo crear aplicaciones web dinámicas mediante [AWS Lambda](http://aws.amazon.com/lambda/) y Amazon API Gateway para autenticar y procesar solicitudes de la API.

Combinando AWS Lambda con otros servicios de AWS, los desarrolladores pueden crear aplicaciones web eficaces que se amplíen y reduzcan automáticamente, y ejecutar una configuración de alta disponibilidad en varios centros de datos sin tener que realizar ningún esfuerzo administrativo para proporcionar escalabilidad, backups o redundancia en varios centros de datos.

En este ejemplo se examina cómo usar AWS Lambda y Amazon API Gateway para crear una aplicación dinámica de emisión de votos, que recibe los votos a través de SMS, suma los totales en Amazon DynamoDB y usa Amazon Simple Storage Service (Amazon S3) para mostrar los resultados en tiempo real.

La arquitectura descrita en este [diagrama](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda-refarch-webapp.pdf) se puede crear con una plantilla de AWS CloudFormation.

[La plantilla](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda_webapp.template) hace lo siguiente:

- Crea un bucket de S3 llamado &lt;S3BucketName\> para almacenar la aplicación web.
- Crea una tabla de DynamoDB llamada `VoteApp` para almacenar los votos
- Crea una tabla de DynamoDB llamada `VoteAppAggregates` para sumar los totales de votos
- Crea una función Lambda que permite a la aplicación recibir los votos
- Crea una función Lambda que permite a la aplicación sumar los votos
- Crea un rol y una política de AWS Identity and Access Management (IAM) para permitir que las funciones Lambda escriban en los logs de Amazon CloudWatch y escriban en las tablas de DynamoDB y las consulten

## Panel dinámico

Los servicios y recursos configurados por la plantilla de AWS CloudFormation se pueden probar con la página HTML `index.html`, que usa archivos HTML, JavaScript y CSS de este repositorio. Puede copiar estos archivos en el bucket de S3 creado por el script de AWS CloudFormation.

## Instrucciones
**Importante:** la plantilla de CloudFormation proporcionada recupera su código Lambda de un bucket de la región us-east-1. Para ejecutar este ejemplo en otra región, modifique la plantilla y cargue el código Lambda en un bucket de esa región. 

Este ejemplo muestra cómo recibir votos a través de mensajes de texto de los usuarios mediante un número de teléfono. Para duplicar el sistema creado por esta arquitectura, tendrá que configurar un número de teléfono con un proveedor externo, como [Twilio](http://twilio.com). Para obtener información detallada, consulte [nuestra entrada](https://medium.com/aws-activate-startup-blog/building-dynamic-dashboards-using-aws-lambda-and-amazon-dynamodb-streams-part-ii-b2d883bebde5) en [AWS Startup Collection at Medium](https://medium.com/aws-activate-startup-blog).

Paso 1: Cree una pila de AWS CloudFormation con la [plantilla](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda_webapp.template) usando un nombre en minúsculas para la pila.

Paso 2: Visite el [panel de API Gateway](https://console.aws.amazon.com/apigateway/home) en su cuenta de AWS y cree un nuevo recurso con un punto de enlace `/vote`. Asigne un método POST que tenga el tipo `Integration Request` de "Lambda Function" y apunte a la función Lambda creada por el script de AWS CloudFormation que recibe el servicio de votos del proveedor externo (en este ejemplo, Twilio).

En `Mapping Templates`, establezca "Content-Type" en `application/x-www-form-urlencoded` y añada [esta plantilla de mapeo](apigateway-mappingtemplate.txt).

Paso 3: Visite el [panel de Amazon Cognito](https://console.aws.amazon.com/cognito/home) y cree un nuevo grupo de identidades para permitir el acceso a identidades no autenticadas. Modifique el documento de la política para permitir el acceso de lectura a la tabla de DynamoDB de totales agregados creada por el script de AWS CloudFormation anterior. Esto permitirá que los usuarios no autenticados reciban datos de la tabla de acumulación de votos de DynamoDB. Amazon Cognito proporcionará el código de muestra para la plataforma JavaScript. Anote el valor del identificador de grupo de identidades; lo necesitará en el paso 4.

Paso 4: Copie los archivos HTML, CSS y JS de este repositorio en el bucket de S3 estático creado para almacenar el panel. Tendrá que abrir `refresh.js` y reemplazar los valores predeterminados de `region` e `identity-pool-id` por sus propios valores.

¡Enhorabuena! Ahora debería tener un ejemplo operativo de la arquitectura de referencia. Podrá recibir votos en tiempo real, ajustar la tabla de DynamoDB para atender varios niveles de tráfico entrante y ver cómo cambian los resultados en el panel en tiempo real.

## Observaciones

El script de AWS CloudFormation creará dos tablas de DynamoDB automáticamente. Aunque puede especificar la capacidad de lectura y escritura a través del script de AWS CloudFormation, no puede especificar los nombres de las tablas en el script. Esto es así porque el código JavaScript que recibe y suma los votos debe conocer los nombres de esas tablas (_VoteApp_ y _VoteAppAggregates_) de antemano. Si desea cambiar los nombres de las tablas de DynamoDB, asegúrese de cambiar los nombres en los propios archivos JavaScript en el código del [origen de acumulación](/lambda-functions/aggregate-votes/) y [el origen de recepción](/lambda-functions/receive-vote/).

## Borrado

Para eliminar automáticamente todos los recursos creados, borre la pila de AWS CloudFormation. Tendrá que eliminar manualmente el punto de enlace de API Gateway y el grupo de identidades de Amazon Cognito.

Nota: el borrado del bucket de S3 dará un error a menos que se borren todos los archivos del bucket antes de eliminar la pila.

## Licencia

Este ejemplo de arquitectura de referencia tiene licencia de Apache 2.0.
