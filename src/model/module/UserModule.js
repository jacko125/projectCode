// Storage-agnostic interface for User objects.
var UserDAO = require('../dao/UserDAO.js');
var User = require('../User.js');

module.exports = {
	
	CreateUser: function(name) {
        UserDAO.CreateUser(name);		
	},
    
    GetUser: function(name) {
        return UserDAO.GetUser(name);
    }

}