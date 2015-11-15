// Modules this controller depends on.
var UserModule = require('../model/module/UserModule.js');

var StaffModule = require('../model/module/StaffModule.js');
// Set initial template variables.
var view = {};

module.exports = {
	
	viewMain: function (req, res) {
		res.render('base/parent.html');
	},
	
    // Example handler that "creates" and "gets" a User.
	testGetUser: function (req, res) {        
		UserModule.CreateUser('TESTUSER');
        var user = UserModule.GetUser('TESTUSER');
		res.send('<h1>Hello, ' + user.name + '!</h1><br>' + user.sayMyName());
	},

    // Example handler that "creates" and "gets" a StaffProfile.
	testGetStaff: function (req, res) {
		StaffModule.CreateStaff('TESTUSER');
        var staff = StaffModule.GetStaff('TESTUSER');
		res.send('<h1>Hello, ' + staff.name + '!</h1><br>' + staff.sayMyName());
	}
}
