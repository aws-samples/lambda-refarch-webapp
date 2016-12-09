# Prerequisites
For the JavaScript SDK to work your APIs need to support CORS. The Amazon API Gateway developer guide explains how to [setup CORS for an endpoint]().
The generated SDK depends on third-party libraries. Include all of the scripts in your webpage

    <script type="text/javascript" src="lib/axios/dist/axios.standalone.js"></script>
    <script type="text/javascript" src="lib/CryptoJS/rollups/hmac-sha256.js"></script>
    <script type="text/javascript" src="lib/CryptoJS/rollups/sha256.js"></script>
    <script type="text/javascript" src="lib/CryptoJS/components/hmac.js"></script>
    <script type="text/javascript" src="lib/CryptoJS/components/enc-base64.js"></script>
    <script type="text/javascript" src="lib/url-template/url-template.js"></script>
    <script type="text/javascript" src="lib/apiGatewayCore/sigV4Client.js"></script>
    <script type="text/javascript" src="lib/apiGatewayCore/apiGatewayClient.js"></script>
    <script type="text/javascript" src="lib/apiGatewayCore/simpleHttpClient.js"></script>
    <script type="text/javascript" src="lib/apiGatewayCore/utils.js"></script>
    <script type="text/javascript" src="apigClient.js"></script>

# Use the SDK in your project

To initialize the most basic form of the SDK:

```
var apigClient = apigClientFactory.newClient();
```

Calls to an API take the form outlined below. Each API call returns a promise, that invokes either a success and failure callback

```
var params = {
    //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
    param0: '',
    param1: ''
};
var body = {
    //This is where you define the body of the request
};
var additionalParams = {
    //If there are any unmodeled query parameters or headers that need to be sent with the request you can add them here
    headers: {
        param0: '',
        param1: ''
    },
    queryParams: {
        param0: '',
        param1: ''
    }
};

apigClient.methodName(params, body, additionalParams)
    .then(function(result){
        //This is where you would put a success callback
    }).catch( function(result){
        //This is where you would put an error callback
    });
```

#Using AWS IAM for authorization
To initialize the SDK with AWS Credentials use the code below. Note, if you use credentials all requests to the API will be signed. This means you will have to set the appropiate CORS accept-* headers for each request.

```
var apigClient = apigClientFactory.newClient({
    accessKey: 'ACCESS_KEY',
    secretKey: 'SECRET_KEY',
    sessionToken: 'SESSION_TOKEN', //OPTIONAL: If you are using temporary credentials you must include the session token
    region: 'eu-west-1' // OPTIONAL: The region where the API is deployed, by default this parameter is set to us-east-1
});
```

#Using API Keys
To use an API Key with the client SDK you can pass the key as a parameter to the Factory object. Note, if you use an apiKey it will be attached as the header 'x-api-key' to all requests to the API will be signed. This means you will have to set the appropiate CORS accept-* headers for each request.

```
var apigClient = apigClientFactory.newClient({
    apiKey: 'API_KEY'
});
```



