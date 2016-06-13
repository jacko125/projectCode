miaApp.factory('userService', ['$http', '$location', '$rootScope',
    function($http, $location, $rootScope) {
    var self = this;    

    var profile = {
        username: '',
        defaultLoc: {},
        defaultLocType: 'NO_DEFAULT',
        defaultLocStart: new Date()
    }; // Used for caching staff results between profile pages.
        
    self.miaUrl = 'http://' + $location.host() + ":" + $location.port();

    var setDefaultLoc = function(location) {               
        var data = {            
            username: $rootScope.user.Shortname,
            location: JSON.stringify({
                building: location.building,
                level: location.level,
                latLng: JSON.stringify(location.latLng)
            })
        };       
        return $http.post(self.miaUrl + '/user/setDefaultLoc', data);                
    };  
    
    var setDefaultLocType = function(locType) {
        var data = {
            username: $rootScope.user.Shortname,
            defaultLocType: locType            
        }
        return $http.post(self.miaUrl + '/user/setDefaultLocType', data);                
    }
    
    var getDefaultLocTypes = function() {
        return [
            { name: 'Never', value: 'NO_DEFAULT' },
            { name: 'For 1 hour', value: 'ONE_HOUR' },
            { name: 'For 2 hours', value: 'TWO_HOURS' },
            { name: 'Until tomorrow', value: 'ONE_DAY' },
            { name: 'Always', value: 'ALWAYS_DEFAULT' }            
        ];
    }
    
    var getTypeString = function(type) {        
        var types = getDefaultLocTypes();
        for (var i = 0; i< types.length; i++) {
            if (types[i].value == type)
                return types[i].name;
        }
        return types[0].name;
    }

    return {               
        setDefaultLoc: setDefaultLoc,
        setDefaultLocType: setDefaultLocType,
        getDefaultLocTypes: getDefaultLocTypes,
        getTypeString: getTypeString
    };
}])
