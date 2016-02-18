miaApp.controller('meetingController', [
    '$http', '$window', '$scope','$rootScope', '$state', '$stateParams',
    'wsService', 'userService',
    function($http, $window, $scope, $rootScope, $state, $stateParams,
             wsService, userService) {              
        var self = this;        
        
        self.title = 'Meeting Room Booking System';
        self.message = 'Welcome ' + $rootScope.user.Description;
                
}]);   