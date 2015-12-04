miaApp.registerCtrl('meetingController', ['$rootScope', function($rootScope) { 
        var self = this;        
        
        self.title = 'Meeting Room Booking System';
        self.message = 'Welcome ' + $rootScope.user.Description;
                
}]);   