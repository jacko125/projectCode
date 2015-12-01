// Routing file, mapping requested URLs to request handlers (controllers)
var homeController = require('./control/HomeController.js');

var expressJwt = require('express-jwt');
var jwtSecret = 'secret';

module.exports = function(app) {
	
    app.get('/', homeController.viewMain);
        
    app.post('/login', homeController.ajaxLogin(jwtSecret));    
        
    app.get('/wsauth', expressJwt({secret: jwtSecret}), homeController.ajaxWsAuth);
    
    app.get('/testsearch', homeController.ajaxTestSearch);
    
	app.get('/test', homeController.testGetUser);
    
    
    // Handle unauthorised requests
    app.use(function (err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
            res.status(401).send('Invalid authorisation token.');
        }
    });
    
    
};
