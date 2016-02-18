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
                        var description = $rootScope.user.FirstName + ' ' + $rootScope.user.LastName;
                        wsService.connect($scope, self.loginForm.username, description, response.data.token);
                        $scope.loggedIn = $rootScope.loggedIn;
                        $scope.$emit('logged-in', $rootScope.user);
                        $state.go('home');
                        
                    }, function error(response) {
                        delete $window.sessionStorage.token;                
                        $state.go('error', { errorCode: 'httpError' });
                    });    
                        
                } else {
                    // Handle erroneous login
                    $scope.errors =[];
                    setError({code: 'loginError'});
                }                                             
                
            }, function error(response) {
                // Handle Staff Search service down
                $scope.$emit('error', 'staffSearchError');                
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
            if (!$rootScope.loggedIn) {
                if (item == 'map') { 
                    return {                
                        'col-xs-6': true,
                        'col-sm-3 ': true,
                        'col-sm-offset-3': true
                    }
                } else if (item == 'login') {
                    return {                
                        'col-xs-6': true,
                        'col-sm-3': true,
                        'col-sm-offset-0': true                        
                    }                    
                }
            } else {
                if (item == 'search') {
                    return {
                        'col-xs-3': true,
                        'col-xs-offset-3': true,
                        'col-sm-4': true,
                        'col-sm-offset-0': true
                    }
                } else if (item == 'map') {
                    return {
                        'col-xs-3': true,
                        'col-xs-offset-0': true,
                        'col-sm-4': true,
                        'col-sm-offset-0': true
                    }
                } else if (item == 'login') {
                    return {                        
                        'col-xs-12': true,                        
                        'col-sm-4': true,
                        'col-sm-offset-0': true
                    }
                }
            }
        }            
        self.mapSubItemClass = function() {
            return {
                'pull-right': !$scope.loggedIn,
                'pull-left': $scope.loggedIn
            }
        }
        self.loginSubItemClass = function() {
            return {
                'tile-wrapper': true
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
