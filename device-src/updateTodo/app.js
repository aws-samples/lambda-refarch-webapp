// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

// default imports
const AWSXRay = require("aws-xray-sdk-core");
const AWS = AWSXRay.captureAWS(require("aws-sdk"));
const { metricScope, Unit } = require("aws-embedded-metrics");
const DDB = new AWS.DynamoDB({ apiVersion: "2012-10-08" });

// environment variables
const { TABLE_NAME, ENDPOINT_OVERRIDE, REGION } = process.env;
const options = { region: REGION };
AWS.config.update({ region: REGION });

if (ENDPOINT_OVERRIDE !== "") {
  options.endpoint = ENDPOINT_OVERRIDE;
}

const docClient = new AWS.DynamoDB.DocumentClient(options);
// response helper
const response = (statusCode, body, additionalHeaders) => ({
  statusCode,
  body: JSON.stringify(body),
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    ...additionalHeaders,
  },
});

function isValidRequest(event) {
  let isIdValid =
    event !== null &&
    event.pathParameters !== null &&
    event.pathParameters.id !== null &&
    /^[\w-]+$/.test(event.pathParameters.id);

  let body = event.body;
  let isBodyValid =
    body !== null && body.completed !== null && body.item !== null;

  return isIdValid && isBodyValid;
}

function getCognitoUsername(event) {
  let authHeader = event.requestContext.authorizer;
  if (authHeader !== null) {
    return authHeader.claims["cognito:username"];
  }
  return null;
}

function updateRecord(username, recordId, eventBody) {
  let d = new Date();
  const params = {
    TableName: TABLE_NAME,
    Key: {
      "cognito-username": username,
      id: recordId,
    },
    UpdateExpression: "set completed = :c, lastupdate_date = :lud, #i = :i",
    ExpressionAttributeNames: {
      // using ExpressionAttributeNames to show how to
      // overcome reserved names, in this case <item>
      "#i": "item",
    },
    ExpressionAttributeValues: {
      ":c": eventBody.completed,
      ":lud": d.toISOString(),
      ":i": eventBody.item,
    },
    ReturnValues: "ALL_NEW",
  };

  return docClient.update(params);
}

// Lambda Handler
exports.updateDeviceItem = metricScope((metrics) => async (event, context) => {
  metrics.setNamespace("Gamevision");
  metrics.putDimensions({ Service: "updateDevice" });
  metrics.setProperty("RequestId", context.requestId);

  if (!isValidRequest(context, event)) {
    metrics.putMetric("Error", 1, Unit.Count);
    return response(400, { message: "Error: Invalid request" });
  }

  try {
    let username = getCognitoUsername(event);
    let data = await updateRecord(
      event.pathParameters.id,
      event.body
    ).promise();
    metrics.putMetric("Success", 1, Unit.Count);
    return response(200, data);
  } catch (err) {
    metrics.putMetric("Error", 1, Unit.Count);
    return response(400, { message: err.message });
  }
});
