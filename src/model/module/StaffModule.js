// Storage-agnostic interface for User objects.
var StaffDAO = require('../dao/StaffDAO.js');
var Staff= require('../Staff.js');

module.exports = {
	
	CreateStaff: function(firstname, lastname) {
        StaffDAO.CreateStaff(firstname, lastname);
	},
    
    GetStaff: function(firstname, lastname) {
        return UserDAO.GetStaff(firstname, lastname);
    }

}
