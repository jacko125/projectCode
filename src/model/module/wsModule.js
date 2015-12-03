// Storage-agnostic interface for User objects.
var http = require('http');
var util = require('util');


var RequestModule = require('./RequestModule.js');
var Request = require('../Request.js');

var ResponseModule = require('./ResponseModule.js');
var Response = require('../Response.js');

module.exports = {
	
    handleMsg: function(wss, ws, message) {
        console.log('incoming message: ' + require('util').inspect(message));
        
        // "username","token"
        switch (message.type) {
            case 'connect':
                console.log('received connection from ' + message.username);
                ws.send(message.sender + ' has connected! Token: ' + message.token);                
                ws.username = message.sender;
                
                sendToClient(wss, ws, message.sender, {
                    type: 'connect',
                    username: message.sender
                    });
                
                break;            
                
            // "sender","recipient","datetime"
            case 'request-location':                
                console.log('Received request for ' + message.recipient + '\'s location');
                                               
                RequestModule.createRequest(new Request(message.sender, message.recipient, message.datetime));                                 
                //TODO Send request to user if connected
                
                break;
                                
            // "sender"
            case 'get-requests':
                console.log('received request for requests from ' + message.sender);
                RequestModule.getRequestsForUser(message.sender, function(requests) {
                   var response = {
                       type: 'request-list',
                       requests: requests
                   }                   
                   sendToClient(wss, ws, message.sender, response);                   
                });
                break;
                
                
            case 'get-responses':
                console.log('received request for responses from ' + message.recipient);
                ResponseModule.getResponsesForUser(message.recipient, function(responses) {
                   var response = {
                       type: 'response-list',
                       responses: responses
                   }                                      
                   sendToClient(wss, ws, message.recipient, response);                   
                });
                break;

            // "sender", "recipient", "location (building, level, latLng)", "datetime"
            case 'respond-location':                      
            
                ResponseModule.createResponse(new Response(message.sender, message.recipient, message.location, message.datetime));                                
                sendToClient(wss, ws, message.recipient, { // Attempt to send response to recipient
                    type: 'response',
                    response: JSON.stringify({
                        sender: message.sender,
                        recipient: message.recipient,
                        location: JSON.stringify(message.location),
                        datetime: message.datetime
                    })
                });
                
                ResponseModule.getResponsesForUser(message.recipient, function(responses) {
                    sendToClient(wss, ws, message.recipient, {
                        type: 'response-list',
                        responses: responses
                    });
                });                                                             
                                
                RequestModule.deleteRequest(message.sender, message.recipient, function() { // Delete from sender's requests                   
                    RequestModule.getRequestsForUser(message.recipient, function(requests) { // Resend sender's requests    
                        sendToClient(wss, ws, message.recipient, {
                            type: 'request-list',
                            requests: requests
                        });
                    });
                });
                
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