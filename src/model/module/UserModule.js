// Storage-agnostic interface for User objects.
var UserDAO = require('../dao/UserDAO.js');
var User = require('../User.js');

module.exports = {
	
	createUser: function(user, callback) {
        UserDAO.createUser({
            user: user,
            callback: callback
        });
	},
    
    getUser: function(username, callback) {
        UserDAO.getUser({
            username: username,
            callback: callback
        });
    },
    
    getAllUsers: function(callback) {
        UserDAO.getAllUsers({
            callback: callback
        });
    },
    
    deleteAllUsers: function() {
        UserDAO.deleteAllUsers();
    }

}