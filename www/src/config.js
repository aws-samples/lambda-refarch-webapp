// You can obtain these values by running:
// aws cloudformation describe-stacks --stack-name <YOUR STACK NAME> --query "Stacks[0].Outputs[]"

const config = {
  "aws_user_pools_web_client_id": "2t6ql38oq0g12581d4tuq1vuo5",     // CognitoClientID
  "api_base_url": "https://i116m3u68d.execute-api.us-east-1.amazonaws.com/prod",                                     // TodoFunctionApi
  "coginto_hosted_domain": "mytodoappdemo-lambda-issue-35.auth.us-east-1.amazoncognito.com",                   // CognitoDomainName
  "redirect_url": "https://issue-35.d26y510u49hqga.amplifyapp.com"                                      // AmplifyURL
};

export default config;
