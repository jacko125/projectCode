module.exports = Staff;

function Staff(firstname, lastname) {
	this.firstname = firstname;
	this.lastname = lastname;
}

Staff.prototype.sayFullName = function () {
	return 'My name is ' + this.firstname + ' ' + this.lastname + '.';
};

