// Storage-agnostic interface for User objects.
var http = require('http');
var util = require('util');


var RequestModule = require('./RequestModule.js');
var Request = require('../Request.js');

var ResponseModule = require('./ResponseModule.js');
var Response = require('../Response.js');

module.exports = {
	
    handleMsg: function(wss, ws, message) {
        console.log('Received: ' + require('util').inspect(message));
        
        // "username","token"
        switch (message.type) {
            case 'connect':
                console.log('received connection from ' + message.sender);
                ws.send(message.sender + ' has connected! Token: ' + message.token);                
                ws.username = message.sender;
                
                sendToClient(wss, ws, message.sender, {
                    type: 'connect',
                    username: message.sender
                    });
                    
                    
                 RequestModule.getRequestsForUser(message.sender, function(requests) {
                   var response = {
                       type: 'request-list',
                       requests: requests
                   }                   
                   sendToClient(wss, ws, message.sender, response);                   
                });
                
                ResponseModule.getResponsesForUser(message.sender, function(responses) {
                   var response = {
                       type: 'response-list',
                       responses: responses
                   }                                      
                   sendToClient(wss, ws, message.sender, response);                   
                });    
                
                break;            
                
            // "sender","recipient","datetime"
            case 'request-location':                
                
                var request = JSON.parse(message.request);                                               
                console.log('Received request for ' + request.recipient + '\'s location');
                RequestModule.deleteRequest(request.sender, request.recipient, function () {
                    RequestModule.createRequest(new Request(request.sender, request.recipient, request.datetime));                                                     
                });                                
                sendToClient(wss, ws, request.recipient, {
                    type: 'request-location',
                    request: JSON.stringify({
                        sender: request.sender,
                        recipient: request.recipient,
                        datetime: request.datetime                                            
                    })                    
                });     
                console.log('Sending request to ' + request.recipient);                
                
                break;
                                
            // "sender"
            case 'get-requests':
                console.log('received request for requests from ' + message.sender);
                break;
                
                
            case 'get-responses':
                console.log('received request for responses from ' + message.recipient);
                break;

            // "sender", "recipient", "location (building, level, latLng)", "datetime"
            case 'respond-location':                      
                var response = JSON.parse(message.response);
                console.log('Received response to ' + response.recipient + '\'s request for ' + response.sender + '\'s location');
                ResponseModule.createResponse(new Response(response.sender, response.recipient, response.location, response.datetime));                                
                sendToClient(wss, ws, response.recipient, { // Attempt to send response to recipient
                    type: 'response',
                    response: JSON.stringify({
                        sender: response.sender,
                        recipient: response.recipient,
                        location: JSON.stringify(response.location),
                        datetime: response.datetime
                    })
                });
                
                // ResponseModule.getResponsesForUser(message.recipient, function(responses) {
                    // sendToClient(wss, ws, message.recipient, {
                        // type: 'response-list',
                        // responses: responses
                    // });
                // });                                                             
                                
                // RequestModule.deleteRequest(message.sender, message.recipient, function() { // Delete from sender's requests                   
                    // RequestModule.getRequestsForUser(message.recipient, function(requests) { // Resend sender's requests    
                        // sendToClient(wss, ws, message.sender, {
                            // type: 'request-list',
                            // requests: requests
                        // });
                    // });
                // });
                
                break;
                
        }
    }	
}

// Send a JSON object to a client (via username). Assumes they are online.
function sendToClient(wss, ws, recipient, message) {
    wss.clients.forEach(function each(client) {                    
        if (client.username == recipient) {
            client.send(JSON.stringify(message));
        }
    });    
}