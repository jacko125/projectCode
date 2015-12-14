miaApp.controller('parentController', [
    '$scope', '$rootScope', '$window', '$state', '$stateParams',
    'ngToast', 'wsService', 'requestService',
    function($scope, $rootScope, $window, $state, $stateParams, ngToast, wsService, requestService) {

        var self = this;
        $scope.notifyCount = 0;
        
        wsService.registerObserverCallback(function(event, data) {
            console.log(event);
            console.log('logging state');      
            switch (event) {                           
                case 'ws-receive-message-list':
                    $scope.notifyCount = requestService.messages.length;                        
                    if ($scope.notifyCount > 0) {
                        var toastMsg = 'You have ' + $scope.notifyCount + ' new notification(s).';
                        showToast(ngToast, toastMsg, 'info');                
                    }
                    break;
                    
                case 'ws-sent-response':                                                  
                    $scope.notifyCount = requestService.messages.length
                    var toastMsg = 'You have responded to ' + data + '\'s request';
                    showToast(ngToast, toastMsg, 'success');      
                    break;                    
                    
                case 'ws-receive-request':                        
                    $scope.notifyCount = requestService.messages.length;
                    var toastMsg = data.senderName + ' has requested your location';
                    showToast(ngToast, toastMsg, 'info');                            
                    break;                                                                
                    
                case 'ws-receive-response':
                    $scope.notifyCount = requestService.messages.length;
                    var toastMsg = data.senderName + ' has responded with their location.';
                    showToast(ngToast, toastMsg, 'success');                     
                    break;
            }            
            $state.transitionTo($state.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        });
        
        
        
        self.notificationButtonClass = function() {
            return {
                'btn': true,
                'navbar-btn': true,
                'btn-info': ($scope.notifyCount > 0),
                'btn-alt': ($scope.notifyCount == 0)                
            }
        }
        self.notificationIconClass = function() {
            return {
                'visible-xs-inline': true,
                'badge-custom': true,
                'badge-active': ($scope.notifyCount > 0),
                'badge-inactive': ($scope.notifyCount == 0)
            }
        }
        
        self.notificationsButtonClick = function() {
            $state.go('notifications');
        }                               
         
        // Login functions
        loginFunctions(self, {
            $scope: $scope,
            $window: $window,
            $state: $state,
            wsService: wsService
        });
        
        $scope.$on('message-remove', function(event, data) {
            $scope.notifyCount = requestService.messages.length;
            if (data.type == 'request') {
                var toastMsg = 'You have ignored ' + data.sender + '\'s request';
                showToast(ngToast, toastMsg, 'warning');                                        
            }
        });        

}]);

function loginFunctions(self, dep) {       

    dep.$scope.loggedIn = false;
        
    dep.$scope.$on('logged_in', function(event, data) {                        
        dep.$scope.username = data.Shortname;        
        dep.$scope.loggedIn = true;                
    });
    
    self.logoutButtonClick = function() {        
        delete dep.$window.sessionStorage.token;
        dep.$scope.loggedIn = false;
        dep.wsService.disconnect();
        dep.$state.go('home');                
        $('.navbar-toggle').click();  // Close nav bar if open        
    }               
}

function showToast(ngToast, message, type) {
    ngToast.create({
        className: type,        
        content: '<div>' + message + '</div>',        
    });    
}

function refreshState($state, $stateParams) {
    var currentState = $state.current;
    if (currentState.name == 'home')
        $state.go('search');
    else 
        $state.go('home');
    $state.go(currentState.name, $stateParams, { reload: true });
}