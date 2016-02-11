module.exports = User;

function User(username) {
	this.username = username;
    
    this.defaultLoc = null;
    this.defaultLocDate = null;
    this.defaultLocType = User.DefaultLocType.NO_DEFAULT;
    
    this.groups = [];
}

User.DefaultLocType = {
    NO_DEFAULT: 'NO_DEFAULT',    
    ONE_HOUR: 'ONE_HOUR',
    TWO_HOURS: 'TWO_HOURS',
    ONE_DAY: 'ONE_DAY',
    ALWAYS_DEFAULT: 'ALWAYS_DEFAULT'
}

// Example class function
User.prototype.sayMyName = function () {
	return null;
};

