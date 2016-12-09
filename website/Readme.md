## Serverless Blog Engine Front End
The front-end website is an Angular 1.5.5 application that uses the following:

- [Angular 1.5.5](https://angularjs.org)
- [Angular Material UI](https://material.angularjs.org)
- [AWS SDK for JavaScript in the Browser](https://aws.amazon.com/sdk-for-browser/)
- [Amazon Cognito Sync Manager](https://github.com/aws/amazon-cognito-js)

The project uses 1 module (index) and components/directives for UI views.

 - website
   - **dist** - production build is generated here, this is what you upload to your S3 bucket
   - **e2e** - end-to-end tests that you can run with gulp test
   - **gulp** - gulp tasks
   - **src** - AngularJS application
     - **app**
     	- components - directives and UI components
     	  - **aws** - main AWS, Amazon API Gateway, and Amazon Cognito services
          - **aws.config.js** - update the Amazon Cognito identity ID and region here
          - **aws.service.js** - AWS services
     	  - **facebook** - login with Facebook directive
     	  - **jumbotron** - the main header
     	  - **navbar** - UI navbar
     	  - **post** - directive that renders a post
     	  - **sidenav** - the side nav bar
     	  - **lib** - vendor / 3rd party libraries including API Gateway SDK
     	  - **aws-api-client** - the API Gateway SDK as generated from the console
     	  - **aws-cognito** - the Amazon Cognito Sync Manager
     	  - **aws-mobile-analytics** - the AWS Mobile Analytics JavaScript SDK
     	- **main** - main view
     	- **post** - post view/s
     	- **index.*** - default application module
     - **assets**
     - **index.html**

After running the CloudFormation template within your account, there are a few steps needed when running the client app:

1. Update the aws-api-client SDK with the endpoint for your deployed API.
2. Update the Amazon Cognito identity ID and region.
3. Build and upload to the S3 bucket or (optional) run locally.

These steps are outlined below.  Note that these steps assume you already have npm installed.  If you do not have npm installed, go to the NodeJS site and get the latest install.  (https://nodejs.org/en/download/)

## Updating the API Gateway SDK
The API Gateway SDK is located at `website/src/lib/aws-api-client`. You need to update the endpoint for the API created by the CloudFormation template.  

1. After you run the CloudFormation stack, pull the output parameter from the stack labeled:
'APIEndpoint'.  
2. Open the file located at `website/src/lib/aws-api-client/apigClient.js` for editing.  
3. Replace the value for 'invokeUrl' variable in the file at line 56 with the APIEndpoint value from the CloudFormation stack output parameters.

## Updating the Amazon Cognito identity ID and AWS region
To update the Amazon Cognito identity ID and AWS region, modify `website/src/app/components/aws/aws.config.js`:

The code will look like:
    angular
        .module('ServerlessBlog')
        .constant('awsRegion','<UPDATE_WITH_REGION>')
        .constant('awsCognitoIdentityPoolId', '<UPDATE_WITH_COGNITO_IDENTITY_ID>')
        .config(config);

After you run the CloudFormation stack, replace the value in the code above with the output parameter from the stack labeled:  **CognitoIdentityPoolId**.

Update the 'awsRegion' value with the region that you are running in.  This will be the first portion of the value of the **CognitoIdentityPoolId** up to the ':'.

## Building

To start, run the following from the website directory:

    $ cd website
    $ sudo npm install -g gulp
    $ sudo npm install -g bower
    $ npm install
    $ bower install

### Production build
To create a production build, run the following from the site directory:

    $ gulp build

This outputs minified scripts that can be uploaded to your S3 static site; **everything within dist/ should be uploaded**. Go to `Upload build to S3` for instructions for uploading to S3.

### Upload build to S3
1. Sign into the AWS management console.
2. Select S3 from the list of services.
3. Select the S3 bucket created by the CloudFormation stack for your website.
4. From the 'Actions' menu, select 'Upload'.
5. Upload the contents of the `website/dist` directory to the S3 bucket.  
6. Click the 'Select Details' button and leave the defaults.
7. Click the 'Set Permissions' button.
8. Select 'Make everything public'.
9. Click 'Start Upload'.
10. Once the upload is complete, your blog is now up and running.  You can find the endpoint for your serverless blog in the CloudFormation stack's output parameter labeled: **WebsiteURL**

### Running locally
To run the website locally instead of on S3, perform the following command:
    $ gulp serve

This should open your browser window to localhost:3000.

(Option) You can also serve the production build locally with the following:

    $ gulp serve:dist

### Tests
You can run protractor tests; make sure you have the Java 7+ runtime installed and run the following from the site directory:

	$ gulp protractor

This should start the protractor tests; the tests can be created and edited in the e2e/ directory. Unit tests can be run with Karma as follows:

	$ gulp test

This runs the unit spec files located in src/app/*.spec.js.
