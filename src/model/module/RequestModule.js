// Storage-agnostic interface for Request objects.
var util = require('util');

var Request = require('../Request.js');
var RequestDAO = require('../dao/RequestDAO.js');

module.exports = {
	
    createRequest: function(request) {       
        RequestDAO.createRequest({ request: request});
    },
        
    deleteAllRequests: function() {        
        RequestDAO.deleteAllRequests();
    },
    
    getRequestsForUser: function(username, callback) {
        RequestDAO.getRequestsForUser({
            username: username,
            callback: callback
        });
    },
    
    getAllRequests: function(callback) {
        RequestDAO.getAllRequests({
            callback: callback
        })
    },
    
    deleteRequest: function(sender, recipient, callback) {
        RequestDAO.deleteRequest({
            sender: sender,
            recipient: recipient, 
            callback: callback
        });
    }
}

