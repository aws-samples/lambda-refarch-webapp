// You can obtain these values by running:
// aws cloudformation describe-stacks --stack-name <YOUR STACK NAME> --query "Stacks[0].Outputs[]"

const config = {
  "aws_user_pools_web_client_id": "1nikeekmd9cq5d5760ugquv0o5",     // CognitoClientID
  "api_base_url": "https://qtqhkw00n4.execute-api.us-east-1.amazonaws.com/{StageNameParam}",                                     // TodoFunctionApi
  "cognito_hosted_domain": "mytodoappdemo-example-stack.auth.us-east-1.amazoncognito.com",                   // CognitoDomainName
  "redirect_url": "https://master.d32ym3po20wpfu.amplifyapp.com"                                      // AmplifyURL
};

export default config;
