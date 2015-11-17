var miaApp = angular.module('mia');

miaApp.registerCtrl('searchController', [function($scope, staffSearchService) {
        var self = this;        
        
        self.title = 'Staff Search'
        self.message = "This page allows you to search for other Macquarie employees";


        self.loadStaffList = function(name) {
            staffSearchService.getStaffList(name).then(function(results)
            {
//                $scope.staffList = results;
            });
        };
}]);
