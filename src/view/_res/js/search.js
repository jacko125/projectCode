miaApp.controller('searchController', [
    '$scope', '$rootScope', '$state', '$stateParams',
    'ngToast','staffSearchService','wsService', 
    function($scope, $rootScope, $state, $stateParams, ngToast, staffSearchService, wsService) {
        var self = this;        
        $scope.group = [];
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
            console.log('button clicked');
            console.log(recipient);
            
            if (!('profile' in $stateParams)) {
                $scope.results.forEach(function(currentProfile) {
                    console.log('iterating');
                    console.log(currentProfile);
                    if (currentProfile.Shortname == recipient) {
                        self.profile = currentProfile;          
                    }                        
                });
            }
            var toastMsg = 'You have requested ' + self.profile.Description + '\'s location';
            ngToast.create({
                className: 'info',
                animation: 'fade',
                content: '<div class="toast">' + toastMsg + '</div>',
                horizontalPosition: 'left'
            });
            wsService.requestLocation($rootScope.user, recipient);            
        }
		
		self.addToGroup = function(staff){
			console.log('add to group button clicked');
			$scope.group.push(staff);
			console.log($scope.group)
		}
        
        // Return to search if profile page accessed directly
        if ('profile' in $stateParams && $stateParams.profile == null) {
            $state.go('search');
        }
    }]);
    
    
function getProfileFromResults(results, shortname) {

    
}
