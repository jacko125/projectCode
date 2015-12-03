miaApp.registerCtrl('homeController', ['$http', '$window', '$scope', 'wsService', 'staffSearchService','$rootScope', 
    function($http, $window, $scope, wsService, staffSearchService, $rootScope) {   
        var self = this;        
        
        // Subpage logic
        self.pages = [
            { name: 'login', template: 'view/home/login.html' },
            { name: 'main', template: 'view/home/main.html' }
        ];
        
        self.selectedPage = self.pages[1];        
            
        self.buttonClick = function(clickedPage) {                
            for (var i = 0; i < self.pages.length; i++) {                    
                if (self.pages[i].name == clickedPage)
                    self.selectedPage = self.pages[i];            
            }        
        };

        self.loginForm = {
            username: "",            
        };
        
        self.loginSubmit = function() {      
        
            staffSearchService.getStaffProfileByShortname(self.loginForm)
                .then(function success(response) {                                                        
                    if (response.data.d.length > 0) {
                        $rootScope.user = processUserDetails(response.data.d[0]);                        
                        $http.post('/login', self.loginForm)
                            .then(function success(response) {               
                                $window.sessionStorage.token = response.data.token;
                                wsService.connect(self.loginForm.username, response.data.token);                    
                                $scope.$emit('logged_in', self.loginForm.username);
                                self.buttonClick('main');                                        
                                
                            }, function error(response) {
                                delete $window.sessionStorage.token;                
                                // Handle HTTP server down
                            });    
                    } else {
                        // Handle erroneous login
                        console.log('nay');
                    }
                }, function error(response) {
                    // Handle Staff Search service down
                });   
            
                
        }
        
        $scope.$on('logged_out', function() {            
           self.buttonClick('main');
        });
        
        self.menuOffsetClass = function() {
            return {
                'col-sm-offset-2' : $scope.loggedIn,
                'col-sm-4': true          
            };
        };
           
    }]);
    
    
function processUserDetails(user) {
    
    var location = user.postalAddress;
    var regEx = /([^\(]*).*/;
    location = location.replace(regEx, "$1");
    user.postalAddress = location.trim();

    return user;
    
}    