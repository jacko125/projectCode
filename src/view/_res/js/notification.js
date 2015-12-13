miaApp.controller('notificationController', [
    '$rootScope', '$scope', '$stateParams',
    'wsService', 'staffSearchService', 'requestService', 
    function($rootScope, $scope, $stateParams, wsService, staffSearchService, requestService) { 
        var self = this;                

        $scope.messages = requestService.messages;
        
        wsService.registerObserverCallback(function(event, data) {
            switch (event) {                
                case 'ws-receive-message-list':
                    $scope.messages = requestService.messages;
                    break;
            }            
        });                
        
        self.removeMessageButtonClick = function(message) {
            wsService.removeMessage(message);      
            $scope.$emit('message-remove', message)
        }                   
}]);

miaApp.controller('messageProfileController', ['$scope', 'staffSearchService', function($scope, staffSearchService) {
    var self = this;
    self.user = {};
    
    $scope.init = function(shortname) {
        staffSearchService.getStaffProfileByShortname(shortname)
            .then(function success(response) {
                self.user = response.data[0];             
                
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
    } else if (interval == 1) {
        return "1 year";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    } else if (interval == 1) {
        return "1 month";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    } else if (interval == 1) {
        return "1 day";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    } else if (interval == 1) {
        return "1 hour";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    } else if (interval == 1) {
        return "1 minute"
    }
    return Math.floor(seconds) + " seconds";
}

