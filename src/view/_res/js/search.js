miaApp.controller('searchController', [
    '$scope', '$rootScope', '$state', '$stateParams',
    'ngToast','staffSearchService','wsService',
    function($scope, $rootScope, $state, $stateParams, ngToast, staffSearchService, wsService) {
        var self = this;

        // Return to search if profile page accessed directly
        if (!$rootScope.loggedIn)
            $state.go('home');
        
        if ('profile' in $stateParams && $stateParams.profile == null)
            $state.go('search');        
        
        if (staffSearchService.group == null)
            staffSearchService.group = [];                
        $scope.group = staffSearchService.group;        
        
        self.searchParams = { name: '' };
        self.profile = $stateParams.profile;
        $scope.requestUserLocation = '';                
        
        $scope.results = staffSearchService.results;
        self.loadStaffList = function() {
            staffSearchService.getStaffList(self.searchParams).then(function(results) {
                console.log(results);
                staffSearchService.results = results.data;
                $scope.results = results.data;
            });
        };        

        self.removeRequestConfirmation = function() {
            $scope.requestUserLocation = null;
        };
        
        self.showRequestConfirmation = function(staffShortName) {
            $scope.requestUserLocation = staffShortName;
        };

        self.sendRequestButtonClick = function(recipient) {
            // Request button was clicked from search-list, so profile is not set yet.
            if (!('profile' in $stateParams))
                self.profile = recipient;

            var toastMsg = 'You have requested ' + self.profile.Description + '\'s location';
            showToast(ngToast, toastMsg, 'info');
            wsService.sendRequest($rootScope.user, recipient.Shortname);
            $scope.requestUserLocation = null;
        }
        
        groupFunctions(self, {
            $rootScope: $rootScope,
            $scope: $scope,            
            ngToast: ngToast,
            wsService: wsService,
            staffSearchService: staffSearchService
        });

}]);

function groupFunctions(self, dep) {
    
        self.sendRequestToGroupButtonClick = function(){
            var toastMsg = 'You have requested the location of the group';
            showToast(dep.ngToast, toastMsg, 'info');
            for(var i = 0; i < dep.staffSearchService.group.length; i++){
                var recipient = dep.staffSearchService.group[i];
                dep.wsService.sendRequest(dep.$rootScope.user, recipient.Shortname);
            }            
        }
        
		self.addToGroupButtonClick = function(staff){						
            if (dep.staffSearchService.group.indexOf(staff) == -1)
                dep.staffSearchService.group.push(staff);
            $("#group-item-container").scrollTop($("#group-item-container")[0].scrollHeight);            
		}        
    
        self.groupRemoveMember = function(staff){
            for (var i = 0; i < dep.staffSearchService.group.length; i++){
                if (dep.staffSearchService.group[i] == staff) 
                    dep.staffSearchService.group.splice(i, 1);
            }
        }

        self.clearGroup = function(){
            dep.staffSearchService.group.length = 0; // Keeps $scope binding intact            
        }        
}

function showToast(ngToast, message, type) {
    ngToast.create({
        className: type,
        content: '<div>' + message + '</div>',
    });
}
