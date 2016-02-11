// Routing file, mapping requested URLs to request handlers (controllers)
var homeController = require('./control/HomeController.js');
var userController = require('./control/UserController.js');

var expressJwt = require('express-jwt');
var jwtSecret = 'secret';

module.exports = function(app) {
	
    app.get('/', homeController.viewMain);
        
    app.post('/login', homeController.ajaxLogin(jwtSecret));            
    app.get('/wsauth', expressJwt({secret: jwtSecret}), homeController.ajaxWsAuth);    
    app.get('/config', homeController.ajaxGetConfig);    
    app.get('/mapViewData', homeController.ajaxGetMapViewData);    
    app.get('/mapItemData', homeController.ajaxGetMapItemData);
    
    app.get('/testGetStaffList', homeController.ajaxTestGetStaffList);    
    app.get('/testGetStaffProfile', homeController.ajaxTestGetStaffProfile);            
    app.get('/dumpMessages', homeController.actionDumpMessages);    
    app.get('/deleteAllMessages', homeController.actionDeleteAllMessages);
    
    app.get('/getUser', expressJwt({secret: jwtSecret}), userController.ajaxGetUser);
    app.get('/dumpUsers', userController.actionDumpUsers);
    app.get('/deleteAllUsers', userController.actionDeleteAllUsers);
    
	app.get('/test', homeController.testGetUser);
    
    
    // Handle unauthorised requests
    app.use(function (err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
            res.status(401).send('Invalid authorisation token.');
        }
    });
    
    
};
