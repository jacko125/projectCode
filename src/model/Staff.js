module.exports = Staff;

function Staff(name) {
	this.name = name;
}

Staff.prototype.sayMyName = function () {
	return 'My name is ' + this.name + '.';
};

