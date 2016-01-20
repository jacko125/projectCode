miaApp.factory('staffSearchService', ['$http', function($http) {
    var self = this;
    var config = require('./../../../../config.json');

    var results = []; // Used for caching staff results between profile pages.
    
    self.staffSearchURL = config.ss-url;

    var getStaffList = function(staffSearchParams) {
        var params = {
            'callback': 'JSON_CALLBACK',
            'name': staffSearchParams.name
        };

        return $http.jsonp(self.staffSearchURL + '/FindADProfileByName', {
            'params': params
        });
    };

    var getProfileImage = function(employeeID) {

    };
    
    var getStaffProfile = function(employeeID) {
        var params = {
            'callback': 'JSON_CALLBACK',
            'employeeID': employeeID
        }
        return $http.jsonp(self.staffSearchURL + '/FindADProfileByEmployeeID', {
           'params' : params 
        });
    }

    var getStaffProfileByShortname = function(shortname) {        
        var params = {
            'callback': 'JSON_CALLBACK',
            'shortname': shortname
        }        
        return $http.jsonp(self.staffSearchURL + '/FindADProfileByShortname', {
            'params' : params            
        });
    }
    
    
    var getStaffListTest = function(staffSearch) {
        var params = {
            'name': staffSearch.name
        };

        return $http.get('/testGetStaffList', {
            'params': params
        });
    }
    
    var getStaffProfileByShortnameTest = function(shortname) {        
        return $http.get('/testGetStaffProfile', {
            params: {                
                username: shortname
            }
        });
    }
    
    var getStaffProfileTest = function(shortname) {        
        return $http.get('/testGetStaffProfile', {
            params: {                
                username: shortname
            }
        });       
    }
    

    return { 
        getStaffList: getStaffList,        
        getProfileImage: getProfileImage,
        getStaffProfile: getStaffProfile,
        getStaffProfileByShortname: getStaffProfileByShortname,
        
        getStaffListTest: getStaffListTest,
        getStaffProfileByShortnameTest: getStaffProfileByShortnameTest,
        getStaffProfileTest: getStaffProfileTest,
    };
}])
