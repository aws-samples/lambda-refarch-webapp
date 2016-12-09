(function() {
  'use strict';
  angular
    .module('ServerlessBlog')
    .constant('awsRegion','<UPDATE_WITH_REGION>')
    .constant('awsCognitoIdentityPoolId', 'UPDATE_WITH_COGNITO_IDENTITY_ID')
    .config(config);

    function config(awsRegion,awsCognitoIdentityPoolId) {
    	var creds = AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    		IdentityPoolId: awsCognitoIdentityPoolId
    	});
    	AWS.config.update({
    		region: awsRegion,
    		credentials: creds
    	});
    };

})();
