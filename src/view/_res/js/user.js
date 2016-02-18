miaApp.controller('userController', [
    '$http', '$window', '$scope','$rootScope', '$state', '$stateParams',
    'wsService', 'userService',
    function($http, $window, $scope, $rootScope, $state, $stateParams,
             wsService, userService) {   
             
        var self = this;
              
        if (!$rootScope.loggedIn)
            $state.go('home');
        
        self.user = $rootScope.user;
        self.profile = userService.profile;                
                                               
        self.DefaultLocTypes = userService.getDefaultLocTypes();
        self.selectedDefaultLocType = self.DefaultLocTypes[0];
        self.DefaultLocTypes.forEach(function(option) {            
            if (userService.profile != null
                && option.value == userService.profile.defaultLocType) {                
                self.selectedDefaultLocType = option;
            }
        });                        
        
        self.displayDefaultLocDate = function() {
            return ['NO_DEFAULT','ALWAYS_DEFAULT','ONE_DAY']
                .indexOf(userService.profile.defaultLocType) == -1;
        }
        
        self.defaultLocTypeChanged = function() {
            userService.setDefaultLocType(self.selectedDefaultLocType.value)
            .then(function success(response) {
                userService.profile = response.data;
                $state.transitionTo($state.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
                $scope.$emit('set-default-loc', 'type');
                    
            }, function error(response) {
                $scope.$emit('error', 'httpError');
            });
        }
        
    }
]);

