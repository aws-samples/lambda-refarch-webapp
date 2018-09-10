# Serverless Reference Architecture:  Web Application

## Note: The Vote Application serverless reference architecture was originally in the lambda-refarch-webapp repository and has since moved to the lambda-refarch-voteapp repository.

The Serverless Web Application ([diagram](https://s3.amazonaws.com/aws-lambda-serverless-web-refarch/RefArch_BlogApp_Serverless.png)) demonstrates how to use [AWS Lambda](http://aws.amazon.com/lambda/) in conjunction with [Amazon API Gateway](http://aws.amazon.com/api-gateway/), [Amazon DynamoDB](http://aws.amazon.com/dynamodb/), [Amazon S3](http://aws.amazon.com/s3/), and [Amazon Cognito](http://aws.amazon.com/cognito/) to build a serverless web application.  

The site is a simple blog application that allows users to log in and create posts and comments. By leveraging these services, you can build cost-efficient web applications that don't require the overhead of managing servers.

This repository contains sample code for all the Lambda functions that make up the back end of the application, as well as an AWS CloudFormation template for creating the functions, API, DynamoDB tables, Amazon Cognito identity pool, and related resources.

## Running the example

The entire example system can be deployed in us-east-1 using the provided CloudFormation template and an S3 bucket.

Choose **Launch Stack** to launch the template in the us-east-1 region in your account:

[![Launch Serverless Web Application into North Virginia with CloudFormation](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/images/cloudformation-launch-stack-button.png)](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=serverless-web-refarch&templateURL=https://s3.amazonaws.com/aws-lambda-serverless-web-refarch/serverless-web-master.template)

After the stack is successfully created, you need to finish the configuration.

- Follow the instructions to minify the website code and push it to S3.  See the [website readme](./website/Readme.md) for step-by-step instructions. Follow the **Updating the API Gateway SDK**, **Updating the Amazon Cognito identity ID and AWS region**, **Building**, and **Production Build** sections.  
- After you have done this, upload the website to the S3 bucket that you created via the CloudFormation script (that is, the bucket you specified for the `Hosting Bucket` parameter).

## Testing the example

After you've successfully uploaded the updated website to S3, go to the URL for the website.  You can find this URL listed in the outputs for the CloudFormation stack you ran earlier, listed as **WebsiteURL**. At this point, your website is up and running. Feel free to interact with it, create posts, comments, etc.

## Cleaning up the example resources

To remove all resources created by this example, do the following:

1. Delete all objects from the `Hosting Bucket` created by the CloudFormation stack.
1. Delete the CloudFormation stack.
1. Delete all CloudWatch log groups for each of the Lambda functions in the stack.
1. Delete the Amazon Cognito identity pool.

## CloudFormation template resources

The following sections explain all of the resources created by the CloudFormation template provided with this example.

### Website

- **WebsiteBucket** - An S3 bucket for the static assets of the web application.  The front-end JavaScript is uploaded to this bucket.

### Lambda functions

- **LambdaCreationHelperStack** - A sub-stack that creates a custom resource for writing entries to `ConfigTable`. This stack creates a Lambda function and execution role that grants UpdateItem permission on `ConfigTable`.

- **SaveCommentFunction** - A Lambda function that saves a comment to `DDBCommentTable`.

- **FindCommentsFunction** - A Lambda function that finds the comments in `DDBCommentTable` for a particular post.

- **FindCommentFunction** - A Lambda function that finds a single comment in `DDBCommentTable`.

- **SavePostFunction** - A Lambda function that saves a post to `DDBPostTable`.

- **FindForumsFunction** - A Lambda function that finds all the forums in `DDBForumTable`.

- **FindPostsFunction** - A Lambda function that finds all the latest posts for a forum in the `DDBLatestPostTable`.

- **FindPostFunction** - A Lambda function that finds a single post in `DDBPostTable`.

- **SaveUserFunction** - A Lambda function that saves a user to `DDBUserTable`.

- **AuthenticateUserFunction** - A Lambda function that authenticates a user against `DDBPostTable`.

### Function roles

- **LambdaToDynamoDBUserTableRole** - An AWS Identity and Access Management (IAM) role assumed by the `SaveUserFunction` and `AuthenticateUserFunction` functions. This role provides logging permissions and access to the `DDBUserTable` and the `DDBConfigTable` tables. It also enables the function to call Amazon Cognito and get an Open ID token for the user.

- **LambdaToDynamoDBPostTableRole** - An IAM role assumed by the `SavePostFunction`, `FindPostsFunction`, and `FindPostFunction` functions. This role provides logging permissions and access to the `DDBPostTable`, `DDBConfigTable`, and the `DDBLatestPostTable` tables.

- **LambdaToDynamoDBCommentTableRole** - An IAM role assumed by the `SaveCommentFunction`, `FindCommentsFunction`, and `FindCommentFunction` functions. This role provides logging permissions and access to the `DDBCommentTable` and the `DDBConfigTable` tables.

- **LambdaToDynamoDBForumTableRole** - An IAM role assumed by the _____ function.  This role provides logging permissions and access to the `DDBForumTable` and the `DDBConfigTable` table.

### API Gateway resources

- **ApiCreationHelperStack** - A sub-stack that creates all the API Gateway resources, methods, and mapping templates.

- **APIGWToLambda** - An IAM role that gives API Gateway permissions to execute the Lambda functions.

- **APIGWRESTAPI** - Creates the API.

- **APIGWRESTAPIlogin** - The login resource.

- **APIGWRESTAPIloginPOST** - The POST method on the login resource.

- **APIGWRESTAPIloginOPTIONS** - The OPTIONS method on the login resource.

- **APIGWRESTAPIuser** - The user resource.

- **APIGWRESTAPIuserPOST** - The POST method on the user resource.

- **APIGWRESTAPIuserOPTIONS** - The OPTIONS method on the user resource.

- **APIGWRESTAPIforums** - The forums resource.

- **APIGWRESTAPIforumsGET** - The GET method that returns all forums.

- **APIGWRESTAPIforumsOPTIONS** - The OPTIONS method on the forums resource.

- **APIGWRESTAPIforum** - The {id} resource representing a forum.

- **APIGWRESTAPIforumposts** - The {id}/posts resource representing posts within a forum.

- **APIGWRESTAPIforumpostsGET** - The GET method on the {id}/posts resource

- **APIGWRESTAPIforumpostsPOST** - The POST method on the {id}/posts resource

- **APIGWRESTAPIforumpostsOPTIONS** - The OPTIONS method on the {id}/posts resource

- **APIGWRESTAPIposts** - The post resource.

- **APIGWRESTAPIpost** - The posts/{id} resource representing a post.

- **APIGWRESTAPIpostGET** - The GET method on the posts/{id} resource.

- **APIGWRESTAPIpostOPTIONS** - The OPTIONS method on the posts/{id} resource.

- **APIGWRESTAPIcomments** - The {id}/comment resource.

- **APIGWRESTAPIcommentsGET** - The GET method on the {id}/comment resource.

- **APIGWRESTAPIcommentsPOST** - The POST method on the {id}/comment resource.

- **APIGWRESTAPIcommentsOPTIONS** - The OPTIONS method on the {id}/comment resource.

- **APIGWRESTAPIcomment** - The {id}/comment/{created-at} resource.

- **APIGWRESTAPIcommentGET** - The GET method on the {id}/comment/{created-at} resource.

- **APIGWRESTAPIcommentOPTIONS** - The OPTIONS method on the {id}/comment/{created-at} resource.

- **APIGWRESTAPIDeployment** - The deployment of the specified stage for the API.


### DynamoDB tables

- **DDBPostTable** - DynamoDB table that stores the post data.

- **DDBCommentTable** - DynamoDB table that stores the comment data.

- **DDBUserTable** - DynamoDB table that stores the user data.

- **DDBForumTable** - DynamoDB table that stores the forum data.

- **DDBLatestPostTable** - DynamoDB table that stores information on the latest posts for a forum.

### Amazon Cognito

- **AuthenticatedBlogUserPolicy** - IAM policy containing the list of API endpoints on which authenticated users in Cognito can call.

- **UnauthenticatedBlogUserPolicy** - IAM policy containing the list of API endpoints on which unauthenticated users in Cognito can call.

- **CognitoCreationHelperStack** - A sub-stack that creates the IAM roles for Amazon Cognito and has custom resources for creating the identity pool.

- **CognitoServerlessBlogUnauthenticatedRole** - IAM role that users who are NOT authenticated assume when interacting with the blog site. This role has the `UnauthenticatedBlogUserPolicy`  policy attached.

- **CognitoServerlessBlogAuthenticatedRole** - IAM role that users who are authenticated assume when interacting with the blog site. This role has the `UnauthenticatedBlogUserPolicy` and ` AuthenticatedBlogUserPolicy` policies attached.

- **LambdaCognitoExecutionRole** - IAM role that the custom resource Lambda function executes under.  

- **CreateCognitoPoolResource** - Custom resource that calls the Lambda function `AddCognitoIdentityPool`.

- **AddCognitoIdentityPool** - Lambda function for creating the Amazon Cognito identity pool.  Also updates LambdaToDynamoDBUserTableRole to add permissions to call the GetOpenIdTokenForDeveloperIdentity function on the Amazon Cognito identity pool just created.

- **UpdateCognitoPoolResource** - Custom resource that calls the Lambda function `UpdateCognitoIdentityPool`.

- **UpdateCognitoIdentityPool** - Lambda function that updates the Amazon Cognito identity pool with the unauthenticated and authenticated IAM roles, `CognitoServerlessBlogUnauthenticatedRole` and ` CognitoServerlessBlogAuthenticatedRole` respectively.  

### Other resources

- **KmsCMK** - The customer master key (CMK) in KMS for encrypting user data in DynamoDB

### Configuration

- **DDBConfigTable** - A DynamoDB table to hold configuration values read by the various Lambda functions. The name of this table, "aws-serverless-config", is hard-coded into each function's code and cannot be modified without updating the code as well.

- **ConfigHelperStack** - A sub-stack that creates a custom resource for writing entries to `ConfigTable`. This stack creates a Lambda function and execution role that grants UpdateItem permission on `ConfigTable`.

- **DDBPostTableConfig** - Configures the DynamoDB post table name for the current environment.

- **DDBCommentTableConfig** - Configures the DynamoDB comment table name for the current environment.

- **DDBUserTableConfig** - Configures the DynamoDB user table name for the current environment.

- **DDBForumTableConfig** - Configures the DynamoDB forum table name for the current environment.

- **DDBLatestPostTableConfig** - Configures the DynamoDB latest post table name for the current environment.

- **CognitoPoolIdConfig** - Configures the Amazon Cognito identity pool ID for the current environment.

- **CognitoPoolDeveloperIdConfig** - Configures the Developer Provider Name for the Amazon Cognito identity pool for the current environment.

- **KMSIdConfig** - Configures the key ID for the KMS CMK used for encrypting data in DynamoDB.

- **PopulateForumsTable** - Custom CloudFormation resource which calls `PopulateForumsTableResource`

- **PopulateForumsTableResource** - Lambda function which populates the DynamoDB forum table with generic values

### Outputs

- **API_endpoint** - This is the endpoint URL for your API Gateway deployed by the CloudFormation stack.

- **WebsiteURL** - Once the website code is uploaded, this is the location of the website running on S3.

- **CognitoIdentityPoolId** - This is the ID for the Cognito Identity Pool.

## License

This reference architecture sample is licensed under Apache 2.0.
