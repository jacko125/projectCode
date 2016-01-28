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
		
		self.addToGroupButtonClick = function(staff){
			console.log('add to group button clicked');
			var contains = $.inArray(staff, $scope.group);
		    if (contains == -1){
				$scope.group.push(staff);
			}
			
			console.log($scope.group)
		}
		
		self.removeMember = function(staff){
			console.log('removeMember button was clicked');
			for (var i = 0; i < $scope.group.length; i++){
				if ($scope.group[i] == staff) $scope.group.splice(i, 1);
			}
			console.log($scope.group);
		}
		
		self.clearGroup = function(){
			console.log('clear Group button was clicked');
			$scope.group = [];
			console.log($scope.group);
		}
		
		self.sendLocationToGroup = function(){
			// TO IMPLEMENT
			console.log('Send location to Group button was clicked');
		}
        
        // Return to search if profile page accessed directly
        if ('profile' in $stateParams && $stateParams.profile == null)
            $state.go('search');
        
    }]);
    
    
function getProfileFromResults(results, shortname) {

    
}
