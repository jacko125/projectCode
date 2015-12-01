// Modules this controller depends on.
var UserModule = require('../model/module/UserModule.js');
var http = require('http');

var jwt = require('jsonwebtoken');
var jwtSecret = 'secret';

module.exports = {
	
	viewMain: function (req, res) {
		res.render('base/parent.html');
	},
       
    ajaxLogin: function (jwtSecret) {               
        // Inject jwtSecret into the handler
        
        return function (req, res) {
            // Actually validate
            console.log('params: ' + require('util').inspect(req.body));
            if (req.body.username != req.body.password) {                       
                res.status(401).send("Invalid username/password combination");
                return;
            }
            
            var token = jwt.sign({ name: req.params.username }, jwtSecret, { expiresIn: '5h' });        
            console.log('returning token ' + token);
            res.json({ token: token });
        }
    },
    
    ajaxWsAuth: function (req, res) {        
        res.status(200).send('Websocket client authenticated');        
    },
    
    ajaxTestSearch: function (req, res) {
        res.json(require('../../testSearchResults.json'));
    },
        
	
    // Example handler that "creates" and "gets" a User.
	testGetUser: function (req, res) {        
		UserModule.CreateUser('TESTUSER');
        var user = UserModule.GetUser('TESTUSER');
		res.send('<h1>Hello, ' + user.name + '!</h1><br>' + user.sayMyName());
	},
}
