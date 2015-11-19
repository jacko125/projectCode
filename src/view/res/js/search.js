miaApp.registerCtrl('searchController', ['$scope', 'staffSearchService', function($scope, staffSearchService) {
        var self = this;        
        
        self.title = 'Staff Search'
        self.message = "This page allows you to search for other Macquarie employees";

        $scope.staffList = '';

        self.loadStaffList = function(name) {
            
            staffSearchService.getStaffList(name).then(function(results) {
                $scope.staffList = results.data;
                console.log(results);
            });
                        
        };
}]);
