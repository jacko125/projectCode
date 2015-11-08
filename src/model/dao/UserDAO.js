// Storage-specific (MongoDB) accessors for User objects.
var User = require('../User.js');

module.exports = {
	
	CreateUser: function(name) {
        var newUser = new User(name);
        // Insert new user into MongoDB        		
	},
    
    GetUser: function(name) {
        var user = new User(name) // "Retrieve" user from MongoDB 
        return user;
    }

}