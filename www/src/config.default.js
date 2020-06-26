// You can obtain these values by running:
// aws cloudformation describe-stacks --stack-name <YOUR STACK NAME> --query "Stacks[0].Outputs[]"

const config = {
  "aws_cognito_region": "AWS_COGNITO_REGION",
  "aws_user_pools_id": "AWS_USER_POOLS_ID",                           // CognitoID
  "aws_user_pools_web_client_id": "AWS_USER_POOLS_WEB_CLIENT_ID",     // CognitoClientID
  "api_base_url": "API_BASE_URL",                                     // TodoFunctionApi
  "coginto_hosted_domain": "COGNITO_HOSTED_DOMAIN",                   // CognitoDomainName
  "redirect_url": "REDIRECT_URL"                                      // AmplifyURL
};

export default config;
