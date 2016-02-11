miaApp.controller('searchController', [
    '$scope', '$rootScope', '$state', '$stateParams',
    'ngToast','staffSearchService','wsService',
    function($scope, $rootScope, $state, $stateParams, ngToast, staffSearchService, wsService) {
        var self = this;

        // Return to search if profile page accessed directly
        if ('profile' in $stateParams && $stateParams.profile == null)
            $state.go('search');

        $scope.group = [];

        self.searchParams = {
            name: ''
        };

        };
        $scope.requestUserLocation = '';

        $scope.results = staffSearchService.results;
        self.loadStaffList = function() {
            staffSearchService.getStaffList(self.searchParams).then(function(results) {
                console.log(results);
                staffSearchService.results = results.data;
                $scope.results = results.data;
            });
        };
        self.profile = $stateParams.profile;

        $scope.initialise = function () {
            $(document).ready(function(){
                $('[data-toggle="tooltip"]').tooltip();
            });
        };

        $scope.removeRequestConfirmation = function() {
            $scope.requestUserLocation = null;
        };

		self.addToGroupButtonClick = function(staff){
			console.log('add to group button clicked');
			var contains = $.inArray(staff, $scope.group);
		    if (contains == -1){
				$scope.group.push(staff);
			}
		}

        self.sendRequestButtonClick = function(recipient) {
            // Request button was clicked from search-list, so profile is not set yet.
            if (!('profile' in $stateParams))
                self.profile = recipient;

            var toastMsg = 'You have requested ' + self.profile.Description + '\'s location';
            showToast(ngToast, toastMsg, 'info');
            wsService.sendRequest($rootScope.user, recipient.Shortname);
            $scope.requestUserLocation = null;
        }

        self.showRequestConfirmation = function(staffShortName) {
            $scope.requestUserLocation = staffShortName;
        };

        self.sendRequestToGroupButtonClick = function(){
            var toastMsg = 'You have requested the location of the group';
            showToast(ngToast, toastMsg, 'info');
            for(var i = 0; i < $scope.group.length; i++){
                var recipient = $scope.group[i];
                wsService.sendRequest($rootScope.user, recipient.Shortname);
            }
            $scope.group = [];
        }

        self.removeMember = function(staff){
            for (var i = 0; i < $scope.group.length; i++){
                if ($scope.group[i] == staff) $scope.group.splice(i, 1);
            }
        }

        self.clearGroup = function(){
            $scope.group = [];
        }
}]);


function getProfileFromResults(results, shortname) {



function showToast(ngToast, message, type) {
    ngToast.create({
        className: type,
        content: '<div>' + message + '</div>',
    });
}
