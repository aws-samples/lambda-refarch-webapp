// You can obtain these values by running:
// aws cloudformation describe-stacks --stack-name <YOUR STACK NAME> --query "Stacks[0].Outputs[]"

const config = {
  "aws_user_pools_web_client_id": "31i4f4k9uqujnsl6o4aumcvlgu",     // CognitoClientID
  "api_base_url": "https://l1unaseofh.execute-api.us-west-2.amazonaws.com/prod",                         // TodoFunctionApi
  "cognito_hosted_domain": "mytodoappdemo-todo-demo.auth.us-west-2.amazoncognito.com",                   // CognitoDomainName
  "redirect_url": "https://master.d1gbbx9nzhqa8j.amplifyapp.com"                                    // AmplifyURL
};

export default config;
