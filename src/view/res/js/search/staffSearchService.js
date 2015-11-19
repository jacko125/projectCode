miaApp.registerFactory('staffSearchService', ['$http', function($http) {

    var defaultStaffProfileData = {
        'firstName': '',
        'lastName': ''
    };

    var getStaffList = function(name) {
        var params = {
            'name': name
        };

        return $http.get('http://employeesearch-uat.pc.internal.macquarie.com/EmployeeSearchService.svc/FindADProfileByName', {
            params: params
        });
    };

    return { 
        getStaffList: getStaffList
    };
}])
