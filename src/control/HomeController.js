// Modules this controller depends on.
var UserModule = require('../model/module/UserModule.js');
var MessageModule = require('../model/module/MessageModule.js');

var http = require('http');
var jwt = require('jsonwebtoken');
var jwtSecret = 'secret';

module.exports = {
	
	viewMain: function (req, res) {
		res.render('_base/parent.html');
	},
       
    ajaxLogin: function (jwtSecret) {               
        // Inject jwtSecret into the handler
        
        return function (req, res) {
            // Validation at client level                 
            console.log("logged in");
            var token = jwt.sign({ name: req.params.username }, jwtSecret, { expiresIn: '5h' });        
            console.log('returning token ' + token);
            res.json({ token: token });
        }
    },
    
    ajaxWsAuth: function (req, res) {        
        res.status(200).send('Websocket client authenticated');        
    },
    
    ajaxGetConfig: function (req, res) {
        res.send("var config = " + JSON.stringify(require('../../resources/config.json')));
    },
    
    ajaxGetMapViewData: function (req, res) {
        res.send("var mapViewData = " + JSON.stringify(require('../../resources/map-view-data.json')));
    },
    ajaxGetMapItemData: function (req, res) {
        res.send("var mapItemData = " + JSON.stringify(require('../../resources/map-item-data.json')));
    },    
        
    ajaxTestGetStaffList: function (req, res) {
        res.json(require('../../resources/test/testGetStaffList.json'));
    },
    
    ajaxTestGetStaffProfile: function (req,res) {
        console.log(require('util').inspect(req.params));
        if (req.query.username == 'hgoh2')
            res.json(require('../../resources/test/testGetStaffProfileA.json'));
        else            
            res.json(require('../../resources/test/testGetStaffProfileB.json'));
    },        
            
    actionDumpMessages: function (req,res) {        
        MessageModule.getAllMessages(function(messages) {
            res.json(messages);
        });        
    },
    
    actionDeleteAllMessages: function (req,res) {        
        MessageModule.deleteAllMessages();
        res.send('<h3>Deleted all messages.</h3>');
    },
	
    // Example handler that "creates" and "gets" a User.
	testGetUser: function (req, res) {        
		UserModule.CreateUser('TESTUSER');
        var user = UserModule.GetUser('TESTUSER');
		res.send('<h1>Hello, ' + user.name + '!</h1><br>' + user.sayMyName());
	},
}
