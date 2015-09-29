# AWS Lambda Reference Architecture: Web Applications

AWS Lambda Reference Architecture for building dynamic Web Applications using AWS Lambda and Amazon API Gateway to authenticate and process API requests.

By combining AWS Lambda with other AWS services, developers can build powerful web applications that automatically scale up and down and run in a highly available configuration across multiple data centers--with zero administrative effort required for scalability, back-ups, or multi-data center redundancy.

In this example, we look at using AWS Lambda and Amazon API Gateway to build a dynamic voting application, which receives votes via SMS, aggregates the totals into Amazon DynamoDB, and uses Amazon S3 to display the results in real-time.

The architecture described in this [diagram](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/lambda-refarch-webapp.pdf) can be created with a CloudFormation template.

[The template](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/vote-app.template) does the following:

- Creates an S3 Bucket named <S3BucketName> to hold your web app.
- Creates a DynamoDB table named <DynamoDBTableName> in which votes will be stored
- Creates a DynamoDB table named <AggregatesTableName> in which vote totals will be aggregated
- Creates a Lambda function that allows your application receive votes
- Creates a Lambda function that allows your application to aggregate votes
- Creates an IAM Role and Policy to allow Lambda Functions to write to CloudWatch Logs and write and query the DynamoDB tables

## Dynamic Dashboard

The services and resources configured by the CloudFormation template can be tested with the HTML page `index.html`, which relies on the HTML, JavaScript, and CSS files found in this repo. You can copy these files to the S3 bucket created by the CloudFormation script.

## Instructions


Step 1 - Create a CloudFormation Stack with the [template](https://s3.amazonaws.com/awslambda-reference-architectures/web-app/vote-app.template) using a lowercase name for the stack

Step 2 - Visit the [API Gateway dashboard](https://console.aws.amazon.com/apigateway/home) in your AWS account and create a new resource with a `/vote` endpoint. Assign a POST method that has the `Integration Request` type of "Lambda Function," and point to the Lambda function created by the CloudFormation script that receives votes from your third-party voting service (in this example, Twilio).

Under `Mapping Templates`, set the "Content-Type" to `application/x-www-form-urlencoded`, and add [this mapping template](https://github.com/awslabs/lambda-refarch-webapp/blob/master/apigateway-mappingtemplate.txt).

Step 3 - Visit the [Amazon Cognito dashboard](https://console.aws.amazon.com/cognito/home) and create a new identity pool that enables access to unauthenticated identities. Modify the policy document to allow read access to the aggregates DynamoDB table created by the CloudFormation script above. This will allow unauthenticated users to retrieve data from the vote aggregation table in DynamoDB. Cognito will provide sample code for the JavaScript platform. Copy the value for Identity Pool ID and replace the `<your-identity-pool-id-here>` section of the refresh.js code with your own identity pool ID (step 4).

Step 4 - Open `refresh.js` and replace default values of region, identity-pool-id, and DynamoDB tables with your own values. Save your changes and place in your static S3 bucket.

Congratulations! You now should have a working example of the reference architecture. You are able to receive votes in real time, tune your DynamoDB table to handle various levels of incoming traffic, and watch your results change on your dashboard in real time!


## Cleanup

To remove all automatically created resources, delete the CloudFormation stack. You will manually need to remove the API Gateway endpoint and the Cognito identity pool.

Note: Deletion of the S3 bucket will fail unless all files in the bucket are removed before the stack is deleted.
