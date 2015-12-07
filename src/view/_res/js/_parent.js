miaApp.controller('parentController', [
    '$scope', '$rootScope', '$window', '$state',
    'ngToast', 'wsService', 'requestService',
    function($scope, $rootScope, $window, $state, ngToast, wsService, requestService) {

        var self = this;
        $scope.requestCount = 0;       
        $scope.responseCount = 0;
        
        wsService.registerObserverCallback(function(event, data) {
            console.log(event);
            switch (event) {                
                case 'ws-receive-request-list':
                    $scope.requestCount = requestService.requests.length;                        
                    if ($scope.requestCount > 0) {
                        var toastMsg = 'You have ' + $scope.requestCount + ' pending request(s).';
                        showToast(ngToast, toastMsg, 'info');                
                    }
                    break;                    
                    
                case 'ws-receive-request':                        
                    $scope.requestCount = requestService.requests.length;
                    var toastMsg = data.sender + ' has requested your location';
                    showToast(ngToast, toastMsg, 'info');        
                    break;                            
                    
                case 'ws-sent-response':                                                  
                    $scope.requestCount = requestService.requests.length
                    var toastMsg = 'You have responded to ' + data + '\'s request';
                    showToast(ngToast, toastMsg, 'success');      
                    break;
                    
                case 'ws-receive-response-list':
                    $scope.responseCount = requestService.responses.length;                        
                    if ($scope.responseCount > 0) {
                        var toastMsg = 'You have received ' + $scope.responseCount + ' response(s)';
                        showToast(ngToast, toastMsg, 'success');                
                    }
                    break;
                    
                case 'ws-receive-response':
                    $scope.responseCount = requestService.responses.length;
                    var toastMsg = data.sender + ' has responded with their location.';
                    showToast(ngToast, toastMsg, 'success');                     
                    break;
            }
        });
                
                
        self.requestsButtonClick = function() {
            $state.go('requests', { action: 'requests' });
        }       
        
        self.responsesButtonClick = function() {
            $state.go('requests', { action: 'responses' });
        }
         
        // Login functions
        loginFunctions(self, {
            $scope: $scope,
            $window: $window,
            $state: $state,
            wsService: wsService
        });                    
        
        $scope.$on('request-ignore', function(event, data) {            
            $scope.requestCount = requestService.requests.length;
            var toastMsg = 'You have ignored ' + data + '\'s request';
            showToast(ngToast, toastMsg, 'danger');                                        
        });
        
        $scope.$on('response-remove', function(event, data) {
            $scope.responseCount = requestService.responses.length;                        
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
        animation: 'fade',
        content: '<div class="toast">' + message + '</div>',
        horizontalPosition: 'left'
    });    
}