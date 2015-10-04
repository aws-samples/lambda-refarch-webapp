/**
 @module twilio

 A helper library for interaction with the Twilio REST API,
 generation of TwiML markup, and creation of capability tokens for
 use with the Twilio Client SDK.
 */

var webhooks = require('./webhooks'),
    RestClient = require('./RestClient'),
    PricingClient = require('./PricingClient'),
    MonitorClient = require('./MonitorClient'),
    TaskRouterClient = require('./TaskRouterClient'),
    LookupsClient = require('./LookupsClient');

//Shorthand to automatically create a RestClient
function initializer(sid, tkn, options) {
    return new RestClient(sid, tkn, options);
}

//Main functional components of the Twilio module
initializer.RestClient = RestClient;
initializer.PricingClient = PricingClient;
initializer.MonitorClient = MonitorClient;
initializer.TaskRouterClient = TaskRouterClient;
initializer.LookupsClient = LookupsClient;
initializer.Capability = require('./Capability');
initializer.TaskRouterCapability = require('./TaskRouterCapability');
initializer.TaskRouterWorkerCapability = require('./TaskRouterWorkerCapability');
initializer.TaskRouterWorkspaceCapability = require('./TaskRouterWorkspaceCapability');
initializer.TaskRouterTaskQueueCapability = require('./TaskRouterTaskQueueCapability');
initializer.TwimlResponse = require('./TwimlResponse');

// Seup webhook helper functionality
initializer.validateRequest = webhooks.validateRequest;
initializer.validateExpressRequest = webhooks.validateExpressRequest;
initializer.webhook = webhooks.webhook;

//public module interface is a function, which passes through to RestClient constructor
module.exports = initializer;
