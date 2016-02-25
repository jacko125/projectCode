module.exports = User;

function User(username, description) {
	this.username = username;
    this.description = description;
    
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
