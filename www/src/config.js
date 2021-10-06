// You can obtain these values by running:
// aws cloudformation describe-stacks --stack-name <YOUR STACK NAME> --query "Stacks[0].Outputs[]"

const config = {
  "aws_user_pools_web_client_id": "2jpqog2ak1t3qt6fmsrmrnrdbo",     // CognitoClientID
  "api_base_url": "https://1d4ldfwec0.execute-api.ap-southeast-1.amazonaws.com/dev",                                    // TodoFunctionApi
  "cognito_hosted_domain": "mytodoappdemo-todo-demo.auth.ap-southeast-1.amazoncognito.com",                   // CognitoDomainName
  "redirect_url": "https://master.d1ooex4fqfbp8g.amplifyapp.com"                                    // AmplifyURL
};

export default config;
