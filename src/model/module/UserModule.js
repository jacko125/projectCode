// Storage-agnostic interface for User objects.
var UserDAO = require('../dao/UserDAO.js');
var User = require('../User.js');

module.exports = {
	
	createUser: function(user, callback) {
        UserDAO.createUser({
            user: user,
            callback: callback
        });
	},
    
    getUser: function(username, callback) {
        UserDAO.getUser({
            username: username,
            callback: callback
        });
    },
    
    // Get user, then update user's default location in callback
    updateUserDefaultLoc: function(username, location, callback) {        
        UserDAO.getUser({
            username: username,
            callback: function(users) {
                var user = users[0];                
                user.defaultLoc = location;
                UserDAO.updateUser({
                    user: user,
                    callback: callback                    
                });
            }
        });
    },
    
    // Get user, then update user's default location type in callback
    updateUserDefaultLocType: function (username, defaultLocType, callback) {
        UserDAO.getUser({
            username: username,
            callback: function(users) {
                var user = users[0];
                user.defaultLocType = defaultLocType;
                user.defaultLocDate = new Date();
                UserDAO.updateUser({
                    user: user,
                    callback: callback
                });                
            }
        });
    },
    
    getAllUsers: function(callback) {
        UserDAO.getAllUsers({
            callback: callback
        });
    },
    
    deleteAllUsers: function() {
        UserDAO.deleteAllUsers();
    },
    
    // Check all users if their default-location has expired.
    // Reset their default location type to 'never' if expired.
    flushUserDefaultLocs: function() {
        UserDAO.getAllUsers({
            callback: function(users) {                
                var now = new Date();
                users.forEach(function(user) {
                    if (user.defaultLocType == User.DefaultLocType.NO_DEFAULT) return;
                    var timeDiffMin = (now.getTime() - user.defaultLocDate.getTime())/(1000 * 60);                    
                    var expired = false;
                    switch (user.defaultLocType) {
                        case User.DefaultLocType.ONE_HOUR:
                            expired = (timeDiffMin / 60) > 1;
                            break;
                        case User.DefaultLocType.TWO_HOURS:
                            expired = (timeDiffMin / 60) > 2
                            break;
                        case User.DefaultLocType.ONE_DAY:
                            expired = user.defaultLocDate.getDay() != now.getDay();
                            break;
                    }
                    if (expired) {
                        updateUserDefaultLocType(user.username, User.DefaultLocType.NO_DEFAULT, function() {
                           console.log('User ' + user.username + ' defaultLocType has expired.');    
                        });                        
                    }
                });
            }
        });
    }

}