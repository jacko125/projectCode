miaApp.registerFactory('staffSearchService', ['$http', function($http) {

    var defaultStaffProfileData = {
        'firstName': '',
        'lastName': ''
    };

    var getStaffList = function(name) {

        var params = {
            'name': name
        };

        //return $http.get('http://employeesearch.pc.internal.macquarie.com/EmployeeSearchService.svc/FindADProfileByName', {                    
        return $http.get('http://staffdirectory.pc.internal.macquarie.com/WebServices/SearchService.svc/SearchStaff', {         
            params: params
        });
        
    };

    return { 
        getStaffList: getStaffList
    };
}])
