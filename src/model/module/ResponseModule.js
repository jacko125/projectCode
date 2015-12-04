// Storage-agnostic interface for Response objects.
var util = require('util');

var Response = require('../Response.js');
var ResponseDAO = require('../dao/ResponseDAO.js');

module.exports = {
	
    createResponse: function(response) {       
        ResponseDAO.createResponse({ response: response });
    },
        
    deleteAllResponses: function() {        
        ResponseDAO.deleteAllResponses();
    },
    
    getResponsesForUser: function(username, callback) {
        ResponseDAO.getResponsesForUser({
            username: username,
            callback: callback
        });
    },
    
    getAllResponses: function(callback) {
        ResponseDAO.getAllResponses({
            callback: callback
        })
    }
    
    // deleteRequest: function(sender, recipient, callback) {
        // RequestDAO.deleteRequest({
            // sender: sender,
            // recipient: recipient, 
            // callback: callback
        // });
    // }
}

