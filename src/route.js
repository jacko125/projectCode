// Routing file, mapping requested URLs to request handlers (controllers)
var homeController = require('./control/HomeController.js');

module.exports = function(app) {
	
    app.get('/', homeController.viewMain);

	app.get('/test', homeController.testGetUser);

	app.get('/staff', homeController.testGetStaff);
};
