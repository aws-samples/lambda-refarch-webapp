// You can obtain these values by running:
// aws cloudformation describe-stacks --stack-name <YOUR STACK NAME> --query "Stacks[0].Outputs[]"

const config = {
  "aws_user_pools_web_client_id": "5ike2fb50ibl0k0qff5sr5c3ja",     // CognitoClientID
  "api_base_url": "https://s7yujxxc15.execute-api.us-east-1.amazonaws.com/prod",                                     // TodoFunctionApi
  "coginto_hosted_domain": "mytodoappdemo-lambda-issue-35.auth.us-east-1.amazoncognito.com",                   // CognitoDomainName
  "redirect_url": "https://amplify-console.d1el6ol1w70dql.amplifyapp.com"                                      // AmplifyURL
};

export default config;
