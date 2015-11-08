// Modules this controller depends on.
var UserModule = require('../model/module/UserModule.js');

// Set initial template variables.
var view = {
    navItems: {
        'Find': '/',
        'About': '/about'
        }
    }

module.exports = {
	
	viewFind: function (req, res) {
        view.selectedItem = "Find";
		res.render('home/find.html', view);
	},
    
    viewAbout: function (req, res) {
        view.selectedItem = "About";
        res.render('home/about.html', view);
    },
	
    // Example handler that "creates" and "gets" a User.
	testGetUser: function (req, res) {        
		UserModule.CreateUser('TESTUSER');
        var user = UserModule.GetUser('TESTUSER');
		res.send('<h1>Hello, ' + user.name + '!</h1><br>' + user.sayMyName());
	},
    
}