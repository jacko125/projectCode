miaApp.controller('userController', [
    '$http', '$window', '$scope','$rootScope', '$state', '$stateParams',
    'userService',
    function($http, $window, $scope, $rootScope, $state, $stateParams,
             userService) {   
             
        var self = this;
        
        if (!$rootScope.loggedIn)
            $state.go('home');
        
        self.user = $rootScope.user;
        self.profile = userService.profile;
        
        self.DefaultLocTypes = [
            { name: 'Never', value: 'NO_DEFAULT' },
            { name: 'For 1 hour', value: 'ONE_HOUR' },
            { name: 'For 2 hours', value: 'TWO_HOURS' },
            { name: 'Until tomorrow', value: 'ONE_DAY' },
            { name: 'Always', value: 'ALWAYS_DEFAULT' }            
        ];
        
    }
]);