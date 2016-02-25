miaApp.controller('parentController', [
    '$scope', '$rootScope', '$window', '$state', '$stateParams',
    'ngToast', 'wsService', 'requestService', 'userService',
    function($scope, $rootScope, $window, $state, $stateParams,
             ngToast, wsService, requestService, userService) {

        var self = this;
        $scope.notifyCount = 0;
        
        // Listen for events from wsService, to display toasts
        wsService.registerObserverCallback(function(event, data) {
            console.log(event);            
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
                    var toastMsg = 'You have responded to ' + data.data.senderName + '\'s request';
                    showToast(ngToast, toastMsg, 'info');      
                    break;                                  
                    
                case 'ws-receive-request':                        
                    $scope.notifyCount = requestService.messages.length;
                    var toastMsg = data.data.senderName + ' has requested your location';
                    showToast(ngToast, toastMsg, 'warning');                            
                    break;                                                                
                    
                case 'ws-receive-response':
                    $scope.notifyCount = requestService.messages.length;
                    var response = data;
                    var autoMsg = (response.data.auto) ? ' <b>automatically</b>': ' has';
                    var toastMsg = response.data.senderName + autoMsg + ' responded with their location.';
                    showToast(ngToast, toastMsg, 'success');                     
                    break;
                
                case 'ws-sent-broadcast':
                    var toastMsg = 'You have sent your location to ' + data.FirstName + ' ' + data.LastName;
                    showToast(ngToast, toastMsg, 'info');      
                    break; 

                case 'ws-receive-broadcast':
                    $scope.notifyCount = requestService.messages.length;
                    var toastMsg = data.senderName + ' has sent you their location.';
                    showToast(ngToast, toastMsg, 'info');      
                    break;
                
                case 'ws-receive-other':
                    $scope.notifyCount = requestService.messages.length;
                    var toastMsg = 'You have new notifications';
                    showToast(ngToast, toastMsg, 'info');
                    break;                                                        
            }            
            
            if (event != 'ws-error') {
                $state.transitionTo($state.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });                
            } else {                
                self.logout();
                $state.transitionTo('error', { errorCode: data }, {
                    reload: true,
                    inherit: false,
                    notify: true
                });                              
            }            
        });
        
        $scope.$on('set-default-loc', function(event, data) {
            var message = '';
            if (data == 'type') {
                message = 'Default location set: ' 
                    + userService.getTypeString(userService.profile.defaultLocType);    
            } else if (data == 'loc') {
                message = 'Default location updated.';
            }            
            showToast(ngToast, message, 'info');                        
        });        
        
        $scope.$on('error', function(event, data) {
            self.logout();
            $('.navbar-toggle').click();      
            $state.go('error', { errorCode: data });                        
        })
        
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
                'visible-sm-inline': true,
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
            $rootScope: $rootScope,
            $window: $window,
            $state: $state,
            ngToast: ngToast,
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
        
    dep.$scope.$on('logged-in', function(event, data) {                        
        dep.$scope.username = data.Shortname; 
        dep.$rootScope.loggedIn = true;
        dep.$scope.loggedIn = true;
        showToast(dep.ngToast, 'Logged in as <b>' + data.Shortname + '</b>', 'success');
    });
    
    self.logout = function() {
        delete dep.$window.sessionStorage.token;
        dep.$scope.loggedIn = false;
        dep.$rootScope.loggedIn = false;
        dep.$rootScope.user = null;
        dep.wsService.disconnect();               
    }        
    
    self.logoutButtonClick = function() {        
        self.logout();
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