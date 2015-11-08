// Routing file, mapping requested URLs to request handlers (controllers)
var homeController = require('./control/HomeController.js');

module.exports = function(app) {
	
    app.get('/', homeController.viewFind);
    app.get('/about', homeController.viewAbout);
	app.get('/test', homeController.testGetUser);
	
};
