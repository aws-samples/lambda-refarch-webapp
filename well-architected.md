# Serverless Reference Architecture: Well-Architected Review -  Serverless Application Lens

Using the Serverless Application Lens, we focus on how to design, deploy, and architect your serverless application workloads on the AWS Cloud. It covers scenarios such as RESTful Microservices, Mobile back-ends, Stream Processing, and Web Application. By using this Well-Architected lens you will learn best practices for building serverless application workloads on AWS.

### Questions and best practices summarized

**OPS 1. How do you understand the health of your Serverless application?**

- Using  application, business, and operations metrics

The application makes use of [Amazon CloudWatch Embedded Metric Format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html) to send custom metrics to Amazon CloudWatch.

We generate additional business metrics the outcomes of each AWS Lambda function and pass it as Amazon CloudWatch Metrics.

**OPS 2. How do you approach application lifecycle management?**

Most of the heavy-lifting is done by using [SAM](https://aws.amazon.com/serverless/sam/) to create our application, manage the differences between deploys, test locally and remotelly, and deploy in different environments.

For this specific scenario, we have not implemented the CI/CD aspect of it, but To help you start right with serverless, AWS has added a Create application experience to the Lambda console. This enables you to create serverless applications from ready-to-use sample applications, which follow these best practices:

Use infrastructure as code (IaC) for defining application resources
Provide a continuous integration and continuous deployment (CI/CD) pipeline for deployment
Exemplify best practices in serverless application structure and methods.

Learn more about this [here](https://aws.amazon.com/blogs/compute/improving-the-getting-started-experience-with-aws-lambda/).

**REL 1. How are you regulating inbound request rates?**

The main entry point for the functionalities on our App is the Amazon API Gateway endpoints. We make use of [Throttling and Daily Quota](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html) to prevent misuse of the application by users. 
The API Usage plan on our case, is defined globally. To understand and create your own Usage Plan definition, please refer to the [documentation on SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-apiusageplan.html).

**REL 2. How are you building resiliency into your Serverless application?**

Our application itself don't have any long-running, complicated transactions at any given point. We have error handling both at backend and frontend.

**SEC 1: How do you control access to your Serverless API?**

We follow the documentation and protect our Amazon API Gateway endpoing using Amazon Cognito. To do the same, please follow the [guide in our documentation](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html).

**SEC 2: How are you managing the security boundaries of your Serverless Application?**

All functionality contained here is extracted to smaller functions, which follows the SRP (Single Responsibility Principle). Given that, each AWS Lambda have strict policies and permissions, allowing us to better control the scope and the access patterns of our services. Learn more about AWS Lambda permissions [here](https://docs.aws.amazon.com/lambda/latest/dg/lambda-permissions.html).

**SEC 3: How do you implement Application Security in your workload?**

While the CI/CD aspect of the application should add the security review of the dependencies; We do validate all request for the necessary and valid request parameters in place before calling downstream services.

**PERF 1. How have you optimized the performance of your Serverless*  *Application?**

To make sure we're using the best performance settings for our AWS Lambda functions, we've used [AWS Lambda Power Tuning](https://github.com/alexcasalboni/aws-lambda-power-tuning). AWS Lambda Power Tuning is an open-source tool that can help you visualize and fine-tune the memory/power configuration of Lambda functions.

**COST 1. How do you optimize your costs?**

Same as the `PERF 1` question, by using [AWS Lambda Power Tuning](https://github.com/alexcasalboni/aws-lambda-power-tuning) we can understand what is the right-sizing approach that we should take with our AWS Lambda parameters and set it for being the most cost-effective one.
Other considerations around long-pooling, using the appropriated services when needed, and creating and caching resources outside the main handler. 