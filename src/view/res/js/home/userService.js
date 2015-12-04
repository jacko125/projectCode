miaApp.registerFactory('userService', [function() {
    var self = this;
    
    self.fields = {};
    
    var setUserObject = function(userObject) {
        console.log('User object is ' + userObject);
        self.fields = userObject;
    }
    
    var getFields = function() {
        return self.fields;
    }
    
    return {
        setUserObject: setUserObject,
        getFields: getFields
    };
    
    }]);