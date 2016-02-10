miaApp.controller('homeController', [
    '$http', '$window', '$scope','$rootScope', '$state', '$stateParams',
    'wsService', 'staffSearchService', 'errorService',
    function($http, $window, $scope, $rootScope, $state, $stateParams,
             wsService, staffSearchService, errorService) {
        var self = this;

        $scope.initialise = function() {
            $(document).ready(function(){
                $('[data-toggle="tooltip"]').tooltip();
            });
        };

        if ('login' in $stateParams && $rootScope.loggedIn)
            $state.go('home');               

        self.loginForm = { username: "" };        
        
        self.loginSubmit = function() {                      
                
            staffSearchService.getStaffProfileByShortname(self.loginForm.username)
            .then(function success(response) {                                
                if (response.data.length > 0) {                    
                    $rootScope.user = processUserDetails(response.data[0]);  // Save user as object
                    $http.post('/login', self.loginForm)
                    .then(function success(response) {                                           
                        $window.sessionStorage.token = response.data.token;
                        wsService.connect($scope, self.loginForm.username, response.data.token);
                        $scope.loggedIn = $rootScope.loggedIn;
                        $scope.$emit('logged_in', $rootScope.user);
                        $state.go('home');
                        
                    }, function error(response) {
                        delete $window.sessionStorage.token;                
                        // Handle HTTP server down
                    });    
                        
                } else {
                    // Handle erroneous login
                    $scope.errors =[];
                    setError({code: 'loginError'});
                }                                             
                
            }, function error(response) {
                // Handle Staff Search service down
            });       
        }

        var setError = function (error) {
            if (!error.message) {
                error.message = errorService.getErrorMessageByCode(error.code);
            }
            if (!error.tooltip) {
                error.tooltip = errorService.getErrorTooltipByCode(error.code);
            }
            $scope.errors.push({code: error.code, message: error.message, tooltip: error.tooltip});
        };

        self.homeItemClass = function(item) {
            if ($scope.loggedIn && item == 'map') {
                return {                
                    'col-xs-12': true,
                    'col-sm-3': !$scope.loggedIn,
                    'col-sm-offset-0': !$scope.loggedIn,
                    'col-sm-4': $scope.loggedIn
                }                                
            } else {
                return {                
                    'col-xs-6': true,
                    'col-sm-3': !$scope.loggedIn,
                    'col-sm-offset-0': !$scope.loggedIn,
                    'col-sm-4': $scope.loggedIn
                }
            }            
        }    
        self.mapItemSubClass = function() {
            return {                
                'pull-right': !$scope.loggedIn,
                'tile-wrapper': $scope.loggedIn
            }
        }
        
}]);
    
    
function processUserDetails(user) {
    
    var location = user.postalAddress;
    var regEx = /([^\(]*).*/;
    location = location.replace(regEx, "$1");
    user.postalAddress = location.trim();

    return user;    
}    
