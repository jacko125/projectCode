module.exports = User;

function User(name) {
	this.name = name;    
}

// Example class function
User.prototype.sayMyName = function () {
	return 'My name is ' + this.name + '.';
};

