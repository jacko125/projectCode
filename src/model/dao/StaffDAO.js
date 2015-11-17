// Storage-specific (MongoDB) accessors for Staff objects.
var Staff = require('../Staff.js');

module.exports = {
	
	CreateStaff: function(name) {
        var newStaff = new Staff(name);
	},
    
    GetStaff: function(name) {
        var staff = new Staff(name)
        return staff;
    }

}
