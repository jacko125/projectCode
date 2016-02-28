// Modules this controller depends on.
var UserModule = require('../model/module/UserModule.js');
var logger = require('winston');

var http = require('http');

module.exports = {
		
    actionDumpUsers: function (req, res) {
        logger.warn('Processed request to dump all users', req.headers);        
        UserModule.getAllUsers(function(users) {
            res.json(users);
        });
    },
    
    actionDeleteAllUsers: function (req, res) {
        logger.warn('Processed request to delete all users', req.headers);
        UserModule.deleteAllUsers();
        res.send('<h3>Deleted all users</h3>');
    },
    
    actionSetDefaultLoc: function (req, res) {                        
        var body = req.body;        
        var username = body.username;
        var location = JSON.parse(body.location);
        location.latLng = JSON.parse(location.latLng);        
        UserModule.updateUserDefaultLoc(username, location, function() {                        
            logger.info('Updating default location for user %s', username, location);
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
            logger.info('Updating default location type for user %s (%s)', username, defaultLocType);
            UserModule.getUser(username, function(users) {
                res.json(users[0]);
            });
        });        
    }
}
