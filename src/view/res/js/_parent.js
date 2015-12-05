// Declare the app module
var miaApp = angular.module('mia', ['ui.router', 'angular-loading-bar', 'ngToast']);

miaApp.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', 
    function($httpProvider, $stateProvider, $urlRouterProvider) { 
        $httpProvider.interceptors.push('authInterceptor');        
}]);

miaApp.factory('authInterceptor', ['$q', '$window', function($q, $window) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;                
            }
            return config;
        },
        response: function (response) {
            if (response.status == 401) {
                // handle forbidden
                console.log('forbidden access');
            }
            return response || $q.when(response);
        }
    };    
}]);

miaApp.controller('parentController', ['$scope', '$rootScope', '$window', 'ngToast', function($scope, $rootScope, $window, ngToast) {

    var self = this;               
    self.navItems = [
            { name: 'Home', template: 'view/home.html'},
            { name: 'Search' , template: 'view/search.html'},
            { name: 'Map' , template: 'view/map.html'},           
        ];            
    
    self.selectedNavItem = self.navItems[0];        
    self.isNavItemActive = function(index) {
        return {                
            active: self.navItems[index] == self.selectedNavItem
        };
    };    
    self.changeNavItem = function(index) {             
        self.selectedNavItem = self.navItems[index];            
    };
    
    self.changeNavItemByName = function(name) {
        for (var i = 0; i < self.navItems.length; i++) {                                
            if (self.navItems[i].name == name)
                self.changeNavItem(i);
        }      
    }    
        
        self.isViewingResponses = $rootScope.isViewingResponses;        
        self.requests = $rootScope.requests;         
        self.responses = $rootScope.responses;        
    // Login functions
    loginFunctions(self, {
        $scope: $scope,
        $window: $window
    });       
                    
    // Request functions    
    requestFunctions(self, {
        $scope: $scope,
        $rootScope: $rootScope,
        ngToast: ngToast        
    });
    
    responseFunctions(self, {
        $scope: $scope,
        $rootScope: $rootScope,
        ngToast: ngToast        
    });  

}]);

function loginFunctions(self, dep) {       

    dep.$scope.loggedIn = false;
        
    dep.$scope.$on('logged_in', function(event, data) {        
        self.changeNavItemByName('Home');        
        dep.$scope.username = data.Shortname;        
        dep.$scope.loggedIn = true;                
    });
    
    self.logoutButtonClick = function() {        
        delete dep.$window.sessionStorage.token;
        dep.$scope.loggedIn = false;
        dep.$scope.$broadcast('logged_out');
        self.changeNavItemByName('Home');        
        $('.navbar-toggle').click();          
    }               
}

function requestFunctions(self, dep) {
    
    self.requestPageButtonClick = function() { 
        dep.$rootScope.isViewingResponses = false;        
        self.selectedNavItem = { name: 'Requests', template: 'view/request.html' };                      
    }   
        
    dep.$scope.requestCount = 0;            
    dep.$scope.$on('ws-receive-request-list', function(event, data) {       
        dep.$scope.$apply(function() { dep.$scope.requestCount = data.length; });                              
    });
    
    dep.$scope.$on('request-location', function (event, data) {
        dep.$scope.$apply(function() { dep.$scope.requestCount = dep.$rootScope.requests.length; });                              
        
        console.log('parent found request-location');
        
        var toastMsg = data.sender + ' has requested your location';
        dep.ngToast.create({
            className: 'info',
            animation: 'fade',
            content: '<div class="toast">' + toastMsg + '</div>',
            horizontalPosition: 'left'
        });
    });
    
    dep.$scope.$on('request-accept', function(event, data) {                
        dep.$rootScope.isChoosingLocation = true;
        dep.$scope.$broadcast('request-accept', data);
        self.changeNavItemByName('Map');
    });
    
    dep.$scope.$on('request-backtolist', function(event) {
        dep.$rootScope.isChoosingLocation = false;
        self.requestPageButtonClick();
    });
}

function responseFunctions(self, dep) {
    self.responsePageButtonClick = function() {
        dep.$rootScope.isViewingResponses = true;        
        self.selectedNavItem = { name: 'Requests', template: 'view/response.html' };                      
    }    
    
           
    dep.$scope.$on('ws-receive-response-list', function(event, data) {       
        console.log('Received response list. Updating number to ' + data.length);        
        console.log(data);        
        dep.$scope.$apply(function() { dep.$scope.responseCount = data.length; });                              
        //toast
    });

    
    dep.$rootScope.$on('ws-receive-response-test-list', function(event, data) {
        console.log('RESPONSE TEST LIST HIT');
    });
   
    dep.$scope.$on('response-backtolist', function(event) {
        dep.$rootScope.isViewingLocation = false;        
        self.responsePageButtonClick();
    });
    
    dep.$rootScope.$on('ws-receive-response-test', function(event, data) {
        console.log('RESPONSE TEST HIT');
        dep.$rootScope.responses.push(data);
        dep.$scope.$apply(function() { dep.$scope.responseCount = dep.$rootScope.responses.length; });                              
    });
    
    dep.$scope.$on('ws-receive-response', function(event, data) {        
    
        console.log('Parent received response');
        var toastMsg = data.sender + ' has sent you their location';
        dep.ngToast.create({
            className: 'success',
            animation: 'fade',
            content: '<div class="toast">' + toastMsg + '</div>',
            horizontalPosition: 'left'
        });
        dep.$rootScope.responses.push(data);
        dep.$scope.$apply(function() { dep.$scope.responseCount = dep.$rootScope.responses.length; });                              
                
    });   
    
    dep.$scope.$on('view-response-parent', function(event, data) {
        dep.$rootScope.viewMapResponse = true;
        dep.$rootScope.responseLocation = data;
        self.changeNavItemByName('Map');        
    });
}

