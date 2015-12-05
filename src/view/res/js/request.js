miaApp.controller('requestController', ['$rootScope', '$scope', 'wsService', 'staffSearchService', 
    function($rootScope, $scope, wsService, staffSearchService) { 
        var self = this;                
                       
        // $rootScope.requests
        // $rootScope.responses
        
        self.isViewingResponses = $rootScope.isViewingResponses;
                
        self.requests = $rootScope.requests;                               
        
        self.acceptRequestButtonClick = function(sender) {       
            $rootScope.responseRecipient = sender;
            $scope.$emit('request-accept', sender); // Broadcast to mapController
        }
        
        self.ignoreRequestButtonClick = function(sender) {
            
        }
        
        // Handle response page
        self.responses = $rootScope.responses;
        
        self.viewResponseButtonClick = function(response) {
            console.log('View response button clicked');
            console.log(response);
            //$scope.$emit('view-response', response);
            $scope.$emit('view-response-parent', response);
            //$rootScope.$broadcast('view-response-map', response);
            //emit to map controllers
            //set map controller viewing mode
            //two buttons - delete and back            
        }
        
        self.ignoreResponseButtonClick = function(sender) {
            
        }        
        
}]);

miaApp.controller('requestProfileController', ['$scope', 'staffSearchService', function($scope, staffSearchService) {
    var self = this;
    self.user = {};
    
    $scope.init = function(shortname) {
        staffSearchService.getStaffProfileByShortname(shortname)
            .then(function success(response) {
                self.user = response.data.d[0];             
                
            }, function error(response) {
                
            });             
    };
        
}]);

miaApp.filter('timeSince', [function() {
    return function(input) {                
        return timeSince(Date.parse(input));                
    }
}]);


function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

