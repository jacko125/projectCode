miaApp.registerCtrl('homeController', ['$http', '$window', 'wsService', 
    function($http, $window, wsService) {   
        var self = this;        
        
        // Subpage logic
        self.pages = [
            { name: 'login', template: 'view/home/login.html' },
            { name: 'main', template: 'view/home/main.html' }
        ];
        
        self.selectedPage = self.pages[1];
        console.log('selected page: ' + self.selectedPage.name);
            
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
                    //Connect to webservice
                    //Go to home page
                    
                }, function error(response) {
                    delete $window.sessionStorage.token;                
                    //handle erroneous login
                });                    
        }                     
    }]);