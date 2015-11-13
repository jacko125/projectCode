// Storage-agnostic interface for User objects.
var StaffDAO = require('../dao/StaffDAO.js');
var Staff= require('../Staff.js');

module.exports = {
	
	CreateStaff: function(name) {
        StaffDAO.CreateStaff(name);
	},
    
    GetStaff: function(name) {
        return UserDAO.GetStaff(name);
    }

}
