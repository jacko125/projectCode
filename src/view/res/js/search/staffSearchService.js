miaApp.registerFactory('staffSearchService', ['$http', function($http) {
    var self = this;
    self.staffSearchURL = 'http://employeesearch-uat.pc.internal.macquarie.com/EmployeeSearchService.svc'

    var getStaffList = function(staffSearch) {
        var params = {
            'name': staffSearch.name
        };

        return $http.get(self.staffSearchURL + '/FindADProfileByName', {
            'params': params
        });
    };

    var getProfileImage = function(employeeID) {

    };
    
    var getStaffProfile = function(employeeID) {
        var params = {
            'employeeID': employeeID
        }
        return $http.get(self.staffSearchURL + '/FindADProfileByEmployeeID', {
           'params' : params 
        });
    }

    var getStaffProfileByShortname = function(shortname) {        
        var params = {
            'shortname': shortname
        }        
        return $http.get(self.staffSearchURL + '/FindADProfileByShortname', {
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
    
    var getStaffProfileByShortnameTest = function(params) {        
        return $http.get('/testGetStaffProfile');
    }
    
    var getStaffProfileTest = function(params) {
        return $http.get('/testGetStaffProfile');
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
