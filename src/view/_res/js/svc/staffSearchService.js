miaApp.factory('staffSearchService', ['$http', function($http) {
    var self = this;    

    var results = []; // Used for caching staff results
    var group = []; // Used for caching groups
    
    self.staffSearchUrl = config.searchUrl;    

    var getStaffList = function(staffSearchParams) {
        
        if (config.test) {
            return getStaffListTest(staffSearchParams);
        }        
        
        var params = {
            'callback': 'JSON_CALLBACK',
            'name': staffSearchParams.name
        };

        return $http.jsonp(self.staffSearchUrl + '/FindADProfileByName', {
            'params': params
        });
    };
    
    var getStaffProfile = function(employeeID) {
        var params = {
            'callback': 'JSON_CALLBACK',
            'employeeID': employeeID
        }
        return $http.jsonp(self.staffSearchUrl + '/FindADProfileByEmployeeID', {
           'params' : params 
        });
    }

    var getStaffProfileByShortname = function(shortname) {            
        if (config.test) {
            return getStaffProfileByShortnameTest(shortname);                        
        }         
        
        var params = {
            'callback': 'JSON_CALLBACK',
            'shortname': shortname
        }               
        return $http.jsonp(self.staffSearchUrl + '/FindADProfileByShortname', {
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
    
    var clearCache = function(staffSearchService) {
        staffSearchService.results = [];
        staffSearchService.groups = [];        
    }
    
    return { 
        getStaffList: getStaffList,                
        getStaffProfile: getStaffProfile,
        getStaffProfileByShortname: getStaffProfileByShortname,
        
        clearCache: clearCache,
        
        getStaffListTest: getStaffListTest,
        getStaffProfileByShortnameTest: getStaffProfileByShortnameTest,
        getStaffProfileTest: getStaffProfileTest,
    };
}])
