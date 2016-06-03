# 无服务器参考架构：Web 应用程序

无服务器参考架构阐述了如何使用 [AWS Lambda](http://aws.amazon.com/lambda/) 构建动态 Web 应用程序以及使用 Amazon API Gateway 对 API 请求进行身份验证和处理。

通过将 AWS Lambda 与其他 AWS 服务相结合，开发人员可以构建功能强大的 Web 应用程序，这些应用程序能够自动扩展和缩减，并且可在多个数据中心之间以高度可用的配置运行，无需执行任何管理工作即可实现可扩展性、备份或多数据中心冗余。

此示例探讨了使用 AWS Lambda 和 Amazon API Gateway 构建动态投票应用程序，该应用程序接收通过 SMS 进行的投票，将投票结果汇总到 Amazon DynamoDB 中，并使用 Amazon Simple Storage Service (Amazon S3) 来实时显示结果。

可以使用 AWS CloudFormation 模板创建在此 [示意图](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda-refarch-webapp.pdf) 中介绍的架构。

使用 [模板](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda_webapp.template) 可执行以下操作：

- 创建名为 &lt;S3BucketName\> 的 S3 存储桶来存放您的 Web 应用程序。
- 创建名为 `VoteApp` 的 DynamoDB 表来存储投票
- 创建名为 `VoteAppAggregates` 的 DynamoDB 表来汇总投票结果
- 创建使您的应用程序能够接收投票的 Lambda 函数
- 创建使您的应用程序能够汇总投票的 Lambda 函数
- 创建 AWS Identity and Access Management (IAM) 角色和策略，以允许 Lambda 函数写入 Amazon CloudWatch 日志以及写入和查询 DynamoDB 表

## 动态仪表板

AWS CloudFormation 模板配置的服务和资源可以使用 HTML 页面 `index.html` 进行测试，该页面采用在此存储库中找到的 HTML、JavaScript 和 CSS 文件。您可以将这些文件复制到由 AWS CloudFormation 脚本创建的 S3 存储桶。

## 说明
**重要提示：** 提供的 CloudFormation 模板会从 us-east-1 区域的存储桶中检索其 Lambda 代码。要在另一个区域中启动此示例，请修改模板并将 Lambda 代码上传到该区域的存储桶中。

此示例演示了通过手机号接收用户使用文本短信发送的投票。要复制使用此架构构建的系统，您需要通过第三方设置电话号码，例如 [Twilio](http://twilio.com)。有关完整详细信息，请阅读 [AWS Startup Collection at Medium](https://medium.com/aws-activate-startup-blog) 上的 [我们的帖子](https://medium.com/aws-activate-startup-blog/building-dynamic-dashboards-using-aws-lambda-and-amazon-dynamodb-streams-part-ii-b2d883bebde5) 。

步骤 1 – 使用 [模板](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda_webapp.template) 创建 AWS CloudFormation，对堆栈使用小写名称。

步骤 2 – 访问您的 AWS 账户中的 [API Gateway 仪表板](https://console.aws.amazon.com/apigateway/home)，使用 `/vote` 终端节点创建新资源。分配带有 `Integration Request` 类型的 "Lambda Function" 的 POST 方法，并指向使用 AWS CloudFormation 脚本创建的 Lambda 函数，该函数将接收来自第三方投票服务的（在此示例中为 Twilio）的投票。

在 `Mapping Templates` 下，将 "Content-Type" 设置为 `application/x-www-form-urlencoded`，并添加 [此映射模板](apigateway-mappingtemplate.txt)。

步骤 3 – 访问 [Amazon Cognito 仪表板](https://console.aws.amazon.com/cognito/home) 并创建新的身份池，该身份池允许未经身份验证的身份进行访问。修改策略文档，以允许对以上 AWS CloudFormation 脚本创建的汇总 DynamoDB 表的读取访问。这将允许未经身份验证的用户从 DynamoDB 中的投票结果汇总表检索数据。Amazon Cognito 将提供适用于 JavaScript 平台的示例代码。请记录身份池 ID 的值；在步骤 4 中您将需要使用该信息。

步骤 4 – 将 HTML、CSS 和 JS 文件从此存储库复制到静态 S3 存储桶，该存储桶是为了存放您的仪表板而创建的。您需要打开 `refresh.js`，并将 `region` 和 `identity-pool-id` 的默认值替换为您自己的值。

恭喜您！现在您已经有了一个可以使用的参考架构示例。您可以实时接收投票，调整您的 DynamoDB 表以处理不同级别的传入流量，并可以实时查看您仪表板上的结果变化！

## 敬请注意

AWS CloudFormation 脚本将为您创建两个 DynamoDB 表。虽然您可以通过 AWS CloudFormation 脚本指定读取和写入容量，不过您无法在脚本中指定表名。这是因为接收和汇总投票的 JavaScript 代码必须预先知道表的名称（_VoteApp_ 和 _VoteAppAggregates_）。如果您希望更改 DynamoDB 表的名称，请确保在 JavaScript 文件本身的代码中更改名称，这些名称位于 [汇总源](/lambda-functions/aggregate-votes/) 和 [接收源](/lambda-functions/receive-vote/) 中。

## 清理

要删除所有自动创建的资源，请删除 AWS CloudFormation 堆栈。您需要手动删除 API Gateway 终端节点以及 Amazon Cognito 身份池。

注意：除非在删除堆栈之前清除了存储桶中的所有文件，否则将无法删除 S3 存储桶。

## 许可证

此示例参考架构已获得 Apache 2.0 许可。
