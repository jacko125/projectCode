miaApp.registerCtrl('homeController', ['$http', '$window', '$scope', 'wsService', 
    function($http, $window, $scope, wsService) {   
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
            password: ""
        };
        
        self.loginSubmit = function() {      
            $http.post('/login', self.loginForm)
                .then(function success(response) {                
                    $window.sessionStorage.token = response.data.token;
                    wsService.connect(self.loginForm.username, response.data.token);                    
                    $scope.$emit('logged_in', self.loginForm.username);
                    self.buttonClick('main');                                        
                    
                }, function error(response) {
                    delete $window.sessionStorage.token;                
                    //handle erroneous login
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