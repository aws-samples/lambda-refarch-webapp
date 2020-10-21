// You can obtain these values by running:
// aws cloudformation describe-stacks --stack-name <YOUR STACK NAME> --query "Stacks[0].Outputs[]"

const config = {
  "aws_user_pools_web_client_id": "None",     // CognitoClientID
  "api_base_url": "None",                                     // TodoFunctionApi
  "cognito_hosted_domain": "None",                   // CognitoDomainName
  "redirect_url": "None"                                      // AmplifyURL
};

export default config;
