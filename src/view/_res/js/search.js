miaApp.controller('searchController', [
    '$scope', '$rootScope', '$state', '$stateParams',
    'ngToast','staffSearchService','wsService', 
    function($scope, $rootScope, $state, $stateParams, ngToast, staffSearchService, wsService) {
        var self = this;        
        
        self.searchParams = {
            name: ''
        };       
                
        $scope.results = staffSearchService.results;
        self.loadStaffList = function() {           
            staffSearchService.getStaffList(self.searchParams).then(function(results) {
                console.log(results);
                staffSearchService.results = results.data;
                $scope.results = results.data;
            });
        };
        self.profile = $stateParams.profile;

        $(document).ready(function(){
            $('[data-toggle="tooltip"]').tooltip();
        });

        self.requestLocationButtonClick = function(recipient) {
            console.log(recipient);
            // Request button was clicked from search-list, so profile is not set yet.
            if (!('profile' in $stateParams))
                self.profile = recipient;

            var toastMsg = 'You have requested ' + self.profile.Description + '\'s location';
            ngToast.create({
                className: 'info',
                animation: 'fade',
                content: '<div class="toast">' + toastMsg + '</div>',
                horizontalPosition: 'left'
            });
            wsService.requestLocation($rootScope.user, recipient.Shortname);
        }

        self.sendLocationButtonClick = function(recipient) {
            console.log("Send location button was clicked");
        }

        self.addToGroupButtonClick = function(recipient) {
            console.log("Add to group button was clicked");
        }
        
        // Return to search if profile page accessed directly
        if ('profile' in $stateParams && $stateParams.profile == null)
            $state.go('search');

    }]);


function getProfileFromResults(results, shortname) {


}
