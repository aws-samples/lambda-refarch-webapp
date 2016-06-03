# Arquitetura de referência sem servidor: aplicações web

Arquitetura de referência sem servidor ilustrando como criar aplicações web dinâmicas usando [AWS Lambda](http://aws.amazon.com/lambda/) e Amazon API Gateway para autenticar e processar solicitações da API.

Combinando o AWS Lambda com outros serviços da AWS, os desenvolvedores podem criar aplicações avançadas que são dimensionadas automaticamente em uma configuração altamente disponível em vários datacenters, sem esforços administrativos necessários para escalabilidade, backups ou redundância de vários datacenters.

Este exemplo analisa o uso de AWS Lambda e Amazon API Gateway para criar uma aplicação dinâmica de votação, que recebe votos via SMS, agrega os totais no Amazon DynamoDB e usa o Amazon Simple Storage Service (Amazon S3) para exibir os resultados em tempo real.

A arquitetura descrita neste [diagrama](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda-refarch-webapp.pdf) pode ser criada com um modelo do AWS CloudFormation.

[O modelo](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda_webapp.template) faz o seguinte:

- Cria um bucket S3 chamado &lt;S3BucketName\> para conter sua aplicação web.
- Cria uma tabela do DynamoDB chamada "VoteApp" para armazenar votos
- Cria uma tabela do DynamoDB chamada "VoteAppAggregates" para agregar os totais de votos
- Cria uma função de Lambda que permite que o aplicativo receba votos
- Cria uma função de Lambda que permite que o aplicativo agregue votos
- Cria uma função do AWS Identity and Access Management (IAM) e uma política para permitir que as funções do Lambda sejam gravadas nos registros do Amazon CloudWatch Logs e sejam gravadas e consultem as tabelas do DynamoDB

## Painel dinâmico

Os serviços e recursos configurados pelo modelo do AWS CloudFormation podem ser testados com a página HTML "index.html", que depende dos arquivos HTML, JavaScript e CSS encontrados nesse repositório. Você pode copiar esses arquivos no bucket S3 criado pelo script do AWS CloudFormation.

## Instruções
**Importante:** o modelo do CloudFormation fornecido recupera seu código do Lambda de um bucket na região us-east-1. Para iniciar esta amostra em outra região, modifique o modelo e faça o upload do código do Lambda em um bucket nessa região. 

Este exemplo demonstra o recebimento de votos via mensagem de texto enviada pelos usuários por um número de telefone. Para duplicar o sistema criado por essa arquitetura, você precisará configurar um número de telefone com terceiros, como [Twilio](http://twilio.com). Para obter todos os detalhes, leia [nossa postagem](https://medium.com/aws-activate-startup-blog/building-dynamic-dashboards-using-aws-lambda-and-amazon-dynamodb-streams-part-ii-b2d883bebde5) em [AWS Startup Collection at Medium](https://medium.com/aws-activate-startup-blog).

Etapa 1 – Crie uma pilha do AWS CloudFormation com o [modelo](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda_webapp.template) usando um nome em letras minúsculas para a pilha.

Etapa 2 – Visite o [API Gateway dashboard](https://console.aws.amazon.com/apigateway/home) na sua conta da AWS e crie um novo recurso com um endpoint "/vote". Atribua um método POST que tenha o tipo "Solicitação de integração" da função do Lambda, e aponte para a função do Lambda criada pelo script do AWS CloudFormation que recebe votos do seu serviço de votação de terceiros (neste exemplo, Twilio).

Em "Modelos de mapeamento", defina "Content-Type" como "application/x-www-form-urlencoded" e adicione [este modelo de mapeamento](apigateway-mappingtemplate.txt).

Etapa 3 – Visite o [Amazon Cognito dashboard](https://console.aws.amazon.com/cognito/home) e crie um novo pool de identidade que permita o acesso a identidades não autenticadas. Modifique o documento de política para permitir o acesso de leitura à tabela agregada do DynamoDB criada pelo script do AWS CloudFormation acima. Desse modo, usuários não autenticados podem recuperar dados da tabela de agregação de votos no DynamoDB. O Amazon Cognito fornecerá o código de exemplo para a plataforma JavaScript. Anote o valor do ID do pool de identidade. Ele será necessário na etapa 4.

Etapa 4 – Copie os arquivos HTML, CSS e JS desse repositório e no bucket S3 estático que foi criado para conter seu painel. Você precisará abrir "refresh.js" e substituir os valores padrão de "region" e "identity-pool-id" por seus próprios valores.

Parabéns! Agora você deve ter um exemplo operacional da arquitetura de referência. Você pode receber votos em tempo real, ajustar sua tabela do DynamoDB para manipular vários níveis de tráfego de entrada e ver os resultados mudando no painel em tempo real.

## Observação

O script do AWS CloudFormation criará duas tabelas do DynamoDB. Embora você consiga especificar a capacidade de leitura e gravação por meio do script do AWS CloudFormation, não conseguirá especificar os nomes de tabela no script. Isso acontece porque o código JavaScript que recebe e agrega votos deve saber os nomes dessas tabelas (_VoteApp_ e _VoteAppAggregates_) com antecedência. Se você quiser mudar os nomes das suas tabelas do DynamoDB, altere os nomes nos arquivos JavaScript propriamente ditos no código encontrado em [origem agregada](/lambda-functions/aggregate-votes/) e [origem de destino](/lambda-functions/receive-vote/).

## Limpeza

Para remover todos os recursos criados automaticamente, exclua a pilha do AWS CloudFormation. Você precisará remover manualmente o endpoint do API Gateway e o pool de identidade do Amazon Cognito.

Observação: a exclusão do bucket S3 falhará, a não ser que todos os arquivos do bucket sejam removidos antes da exclusão da pilha.

## Licença

Este exemplo de arquitetura de referência é licenciado sob a licença do Apache 2.0.
