// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

// default imports
const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const { metricScope, Unit } = require("aws-embedded-metrics")
const DDB = new AWS.DynamoDB({ apiVersion: "2012-10-08" })


// environment variables
const { TABLE_NAME, ENDPOINT_OVERRIDE, REGION } = process.env
const options = { region: REGION }
AWS.config.update({ region: REGION })

if (ENDPOINT_OVERRIDE !== "") {
    options.endpoint = ENDPOINT_OVERRIDE
}

const docClient = new AWS.DynamoDB.DocumentClient(options)
// response helper
const response = (statusCode, body, additionalHeaders) => ({
    statusCode,
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', ...additionalHeaders },
})

function isValidRequest(context, event) {
    return (event !== null) &&
        (event.pathParameters !== null) &&
        (event.pathParameters.id !== null) &&
        (/^[\w-]+$/.test(event.pathParameters.id))
}

function getRecordById(recordId) {
    let params = {
        TableName: TABLE_NAME,
        Key: {
            "id": recordId
        }
    }

    return docClient.get(params)
}

// Lambda Handler
exports.getToDoItem =
    metricScope(metrics =>
        async (event, context, callback) => {
            metrics.setNamespace('TodoApp')
            metrics.putDimensions({ Service: "getTodo" })
            metrics.setProperty("RequestId", context.requestId)
            if (!isValidRequest(context, event)) {
                metrics.putMetric("Error", 1, Unit.Count)
                return response(400, { message: "Error: Invalid request" })
            }

            try {
                let data = await getRecordById(event.pathParameters.id).promise()
                metrics.putMetric("Success", 1, Unit.Count)
                return response(200, data)

            } catch (err) {
                metrics.putMetric("Error", 1, Unit.Count)
                return response(400, { message: err.message })
            }
        }
    )
