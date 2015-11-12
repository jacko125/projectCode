// Storage-specific (MongoDB) accessors for Staff objects.
var Staff = require('../Staff.js');

module.exports = {
	
	CreateStaff: function(firstname, lastname) {
        var newStaff = new Staff(firstname, lastname);
	},
    
    GetStaff: function(firstname, lastname) {
        var staff = new Staff(firstname, lastname)
        return staff;
    }

}
