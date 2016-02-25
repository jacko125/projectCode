// Storage-agnostic interface for Message objects.
var MessageDAO = require('../dao/MessageDAO.js');
var Message = require('../Message.js');

module.exports = {
	
    createMessage: function(message) {       
        MessageDAO.createMessage({
            message: message
        });
    },
    
    deleteMessage: function(message, callback) {
        MessageDAO.deleteMessage({
            query: {
                type: message.type,
                sender: message.sender,
                recipient: message.recipient
            },
            callback: callback
        });
    },
        
    deleteAllMessages: function() {        
        MessageDAO.deleteAllMessages();
    },
    
    getMessagesForUser: function(username, callback) {
        MessageDAO.getMessagesForUser({
            username: username,
            callback: callback
        });
    },
    
    getAllMessages: function(callback) {
        MessageDAO.getAllMessages({
            callback: callback
        });
    },
    
    flushMessages: function() {
        MessageDAO.getAllMessages({
            callback: function(messages) {
                var now = new Date();
                messages.forEach(function(message) {
                    message.datetime = new Date(message.datetime);
                    var timeDiffMin = (now.getTime() - message.datetime.getTime()) / (1000 * 60);
                    if (timeDiffMin > 30) {
                        MessageDAO.deleteMessage({
                            query: {
                                type: message.type,
                                sender: message.sender,
                                recipient: message.recipient
                            },
                            callback: function() {
                                console.log('Message expired (' 
                                    + message.sender + ':' + message.recipient
                                    + ' - ' + message.type + ')');
                            }
                        });                                                
                    }
                })
            }
        })
    }
}

