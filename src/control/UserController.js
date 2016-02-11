// Modules this controller depends on.
var UserModule = require('../model/module/UserModule.js');

var http = require('http');

module.exports = {
		
    actionDumpUsers: function (req, res) {
        UserModule.getAllUsers(function(users) {
            res.json(users);
        });
    },
    
    actionDeleteAllUsers: function (req, res) {
        UserModule.deleteAllUsers();
        res.send('<h3>Deleted all users</h3>');
    }
    
}
