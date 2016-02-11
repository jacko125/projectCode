// Storage-agnostic interface for User objects.
var http = require('http');
var util = require('util');

var User = require('../User.js');
var UserModule = require('./UserModule.js');

var Message = require('../Message.js');
var MessageModule = require('./MessageModule.js');
var MessageType = {
    REQUEST: 'request',
    RESPONSE: 'response'
};

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
                console.log('Received request for ' + request.recipient + '\'s location');                                
                MessageModule.deleteMessage({
                    type: MessageType.REQUEST,
                    sender: request.sender,
                    recipient: request.recipient
                }, function () {                                                          
                    UserModule.getUser(request.recipient, function(users) {
                        var user = users[0];
                        // Automatically bounce
                        if (user.defaultLocType != User.DefaultLocType.NO_DEFAULT) {
                            var response = {
                                type: MessageType.RESPONSE,
                                sender: request.recipient,
                                recipient: request.sender,
                                datetime: new Date(),
                                data: {
                                    senderName: user.description,
                                    location: user.defaultLoc,
                                    auto: true,
                                }
                            }
                            MessageModule.createMessage(response);                                                                       
                            sendToClient(wss, ws, request.sender, response); 
                            console.log ('Sending auto-response to ' + request.recipient);                                     
                        } else {
                            MessageModule.createMessage(new Message(request));      
                            sendToClient(wss, ws, request.recipient, request);     
                            console.log ('Sending request to ' + request.recipient);                                     
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
                console.log('Received response to ' + response.recipient + '\'s request for ' + response.sender + '\'s location');                
                MessageModule.deleteMessage({
                    type: 'response',
                    sender: response.sender,
                    recipient: response.recipient,
                }, function() {
                    MessageModule.createMessage(response);                                    
                });                
                sendToClient(wss, ws, response.recipient, response);                
                break;
                
            case 'broadcast':
                var broadcast = message;                
                broadcast.data = JSON.parse(broadcast.data);
                broadcast.data.location = JSON.parse(broadcast.data.location);                
                broadcast.data.location.latLng = JSON.parse(broadcast.data.location.latLng);                         
                console.log('Received location broadcast from ' + broadcast.sender + ' to ' + broadcast.recipient);                
                MessageModule.deleteMessage({
                    type: 'broadcast',
                    sender: broadcast.sender,
                    recipient: broadcast.recipient,
                }, function() {
                    MessageModule.createMessage(broadcast);                                    
                });                
                sendToClient(wss, ws, broadcast.recipient, broadcast);                
                break;                        
                            
            case 'remove-message':
                var msg = JSON.parse(message.message);
                console.log('Received remove-request ' + msg.sender + ':' + msg.recipient);
                console.log(util.inspect(msg));
                MessageModule.deleteMessage(msg, function() {}); 
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