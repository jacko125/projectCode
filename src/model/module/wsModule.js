// Storage-agnostic interface for User objects.
var http = require('http');
var util = require('util');
var logger = require('winston');

var User = require('../User.js');
var UserModule = require('./UserModule.js');

var Message = require('../Message.js');
var MessageModule = require('./MessageModule.js');
var MessageType = {
    REQUEST: 'request',
    RESPONSE: 'response',
    BROADCAST: 'broadcast',
    OTHER: 'other'
};

var MessageSubtype = {
    AUTO_RESPONSE_NOTIFY: 'auto-response-notify'    
}

module.exports = {
	
    handleMsg: function(wss, ws, message) {                
        // "username","token"
        switch (message.type) {
            case 'connect':                                
                ws.username = message.sender;
                
                logger.info('Received connection from user %s', message.sender);
                sendToClient(wss, ws, message.sender, {
                    type: 'connect',
                    username: message.sender
                    });                
                
                // Get all messages for user, sort by datetime and send.
                MessageModule.getMessagesForUser(message.sender, function(messages) {    
                    messages.sort(function(a, b) {
                       return a.datetime > b.datetime;
                    });
                    sendToClient(wss, ws, message.sender, {
                        type: 'message-list',
                        messages: messages
                    });                    
                });          
                
                UserModule.getUser(message.sender, function(users) {
                    if (users.length == 0) {
                        UserModule.createUser(new User(message.sender, message.description), function(user) {                            
                            logger.info('Created new user', { user: user });        
                            sendToClient(wss, ws, message.sender, {
                                type: 'user-login',
                                user: JSON.stringify(user)
                            });
                        })
                    } else {                        
                        sendToClient(wss, ws, message.sender, {
                            type: 'user-login',
                            user: JSON.stringify(users[0])
                        });                        
                    }     
                });                
                break;            
                
            // data: senderName
            case 'request':                                                
                var request = message;
                request.data = JSON.parse(request.data);                                
                MessageModule.deleteMessage({
                    type: MessageType.REQUEST,
                    sender: request.sender,
                    recipient: request.recipient
                }, function () {                                                          
                    UserModule.getUser(request.recipient, function(users) {
                        var user = users[0];
                        // Automatically bounce request if defaultLocType is active
                        if (user != null && user.defaultLocType != User.DefaultLocType.NO_DEFAULT) {
                            var response = new Message({
                                type: MessageType.RESPONSE,
                                sender: request.recipient,
                                recipient: request.sender,
                                datetime: new Date(),
                                data: {
                                    senderName: user.description,
                                    location: user.defaultLoc,
                                    auto: true,
                                }
                            });
                            MessageModule.createMessage(response);                                       
                            logger.info('Auto-responding to request for location', response);
                            sendToClient(wss, ws, request.sender, response);                                                         
                            var requestNotification = new Message({
                                type: MessageType.OTHER,
                                sender: request.sender,
                                recipient: request.recipient,
                                datetime: new Date(),
                                data: {
                                    senderName: request.data.senderName,
                                    subtype: MessageSubtype.AUTO_RESPONSE_NOTIFY
                                }                                
                            });                
                            MessageModule.createMessage(requestNotification)
                            sendToClient(wss, ws, request.recipient, requestNotification);
                            
                        } else {
                            MessageModule.createMessage(new Message(request));      
                            logger.info('Forwarding request for location', request);
                            sendToClient(wss, ws, request.recipient, request);                                                             
                        }                        
                    })                                        
                })
                                
                break;                                      

            // data: senderName, location (building, level, latLng)
            case 'response':                      
                var response = message;                
                response.data = JSON.parse(response.data);
                response.data.location = JSON.parse(response.data.location);                
                response.data.location.latLng = JSON.parse(response.data.location.latLng);                                         
                MessageModule.deleteMessage({
                    type: 'response',
                    sender: response.sender,
                    recipient: response.recipient,
                }, function() {
                    MessageModule.createMessage(response);                                    
                });                
                logger.info('Forwarding response to request', response);
                sendToClient(wss, ws, response.recipient, response);                
                break;
                
            case 'broadcast':
                var broadcast = message;                
                broadcast.data = JSON.parse(broadcast.data);
                broadcast.data.location = JSON.parse(broadcast.data.location);                
                broadcast.data.location.latLng = JSON.parse(broadcast.data.location.latLng);                                         
                MessageModule.deleteMessage({
                    type: 'broadcast',
                    sender: broadcast.sender,
                    recipient: broadcast.recipient,
                }, function() {
                    MessageModule.createMessage(broadcast);                                    
                });
                logger.info('Forwarding location broadcast', broadcast);
                sendToClient(wss, ws, broadcast.recipient, broadcast);                
                break;                        
                            
            case 'remove-message':
                var msg = JSON.parse(message.message);                
                logger.info('Deleting message', { message: msg });
                MessageModule.deleteMessage(msg, function() {}); 
                break;             

            default:
                logger.warn('Received message of unknown type', message);
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