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
    },
    
    actionSetDefaultLoc: function (req, res) {                        
        var body = req.body;        
        var username = body.username;
        var location = JSON.parse(body.location);
        location.latLng = JSON.parse(location.latLng);        
        UserModule.updateUserDefaultLoc(username, location, function() {                        
            UserModule.getUser(username, function(users) {
                res.json(users[0]);
            });
        });               
    },
    actionSetDefaultLocType: function (req, res) {
        var body = req.body;
        var username = body.username;
        var defaultLocType = body.defaultLocType;
        UserModule.updateUserDefaultLocType(username, defaultLocType, function() {
            UserModule.getUser(username, function(users) {
                res.json(users[0]);
            });
        });        
    }
}
