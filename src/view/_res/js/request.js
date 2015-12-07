miaApp.controller('requestController', [
    '$rootScope', '$scope', '$stateParams',
    'wsService', 'staffSearchService', 'requestService', 
    function($rootScope, $scope, $stateParams, wsService, staffSearchService, requestService) { 
        var self = this;
        
        $scope.action = $stateParams.action;
        
        $scope.requests = requestService.requests;
        $scope.responses = requestService.responses;                                             
        
        wsService.registerObserverCallback(function(event, data) {
            switch (event) {                
                case 'ws-receive-request-list':                    
                    $scope.requests = requestService.requests;           
                    break;                    
                case 'ws-receive-request':    
                    $scope.requests = requestService.requests;
                    break;                            
            }            
        })
        
        self.ignoreRequestButtonClick = function(request) {
            console.log('incoming req');
            console.log(request);
            requestService.removeRequest(requestService, request.sender);
            wsService.removeRequest(request);
            $scope.$emit('request-ignore', request.sender);            
        }
            
        self.removeResponseButtonClick = function(response) {            
            requestService.removeResponse(requestService, response.sender);
            wsService.removeResponse(response);
            $scope.$emit('response-remove', response.sender);
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

