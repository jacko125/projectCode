miaApp.controller('searchController', [
    '$scope', '$rootScope', '$stateParams',
    'ngToast','staffSearchService','wsService', 
    function($scope, $rootScope, $stateParams, ngToast, staffSearchService, wsService) {
        var self = this;        
        
        self.searchParams = {
            name: ''
        };       
                
        $scope.results = staffSearchService.results;
        self.loadStaffList = function() {           
            staffSearchService.getStaffListTest(self.searchParams).then(function(results) {
                console.log(results);
                staffSearchService.results = results.data;
                $scope.results = results.data;
            });
        };
        self.profile = $stateParams.profile;
        
        self.requestLocationButtonClick = function(recipient) {
            var toastMsg = 'You have requested ' + self.profile.Description + '\'s location';
            ngToast.create({
                className: 'info',
                animation: 'fade',
                content: '<div class="toast">' + toastMsg + '</div>',
                horizontalPosition: 'left'
            });
            wsService.requestLocation($rootScope.user.Shortname, recipient);            
        }
    }]);
