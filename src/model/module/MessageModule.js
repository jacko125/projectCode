var MessageDAO = require('../dao/MessageDAO.js');
var Message = require('../Message.js');

// Storage-agnostic interface for Message objects.
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
    }
}

