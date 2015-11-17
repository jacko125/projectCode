// Declare the app module
var miaApp = angular.module('mia');

miaApp.factory('staffSearchService', ['$http', function($http) {

    var defaultStaffProfileData = {
        'firstName': = ''
        'lastName': = ''
    };

    var getStaffList = function(name) {

        var params = {
            'name': name
        };

        $http.get('http://staffdirectory.pc.internal.macquarie.com/WebServices/SearchService.svc/SearchStaff', {
            params: params
        }).success(function (result) {
            console.log(result);
        })
    };

    return {
    getStaffList: getStaffList
    };
}])
