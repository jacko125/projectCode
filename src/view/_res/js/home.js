miaApp.controller('homeController', [
    '$http', '$window', '$scope','$rootScope', '$state', 
    'wsService', 'staffSearchService', 
    function($http, $window, $scope, $rootScope, $state, wsService, staffSearchService) {   
        var self = this;
        
        self.loginButtonClick = function() { $state.go('login'); };

        self.loginForm = { username: "" };        
        
        self.loginSubmit = function() {                      
                
            staffSearchService.getStaffProfileByShortnameTest(self.loginForm.username)
            .then(function success(response) {                                
                if (response.data.length > 0) {                    
                    $rootScope.user = processUserDetails(response.data[0]);  // Save user as object
                    $http.post('/login', self.loginForm)
                    .then(function success(response) {                                           
                        $window.sessionStorage.token = response.data.token;
                        wsService.connect($scope, self.loginForm.username, response.data.token);
                        $scope.$emit('logged_in', $rootScope.user);
                        $state.go('home');
                        
                    }, function error(response) {
                        delete $window.sessionStorage.token;                
                        // Handle HTTP server down
                    });    
                        
                } else {
                    // Handle erroneous login                        
                }                                             
                
            }, function error(response) {
                // Handle Staff Search service down
            });       
    }                   
}]);
    
    
function processUserDetails(user) {
    
    var location = user.postalAddress;
    var regEx = /([^\(]*).*/;
    location = location.replace(regEx, "$1");
    user.postalAddress = location.trim();

    return user;    
}    