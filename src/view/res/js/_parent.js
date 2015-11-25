// Declare the app module
var miaApp = angular.module('mia', []);

miaApp.config(['$httpProvider', '$controllerProvider', '$provide', function($httpProvider, $controllerProvider, $provide) { 
    $httpProvider.interceptors.push('authInterceptor');
    miaApp.registerCtrl = $controllerProvider.register;
    miaApp.registerFactory = $provide.factory;
}]);

miaApp.controller('parentController', [function() {

    var self = this;               
    self.navItems = [
            { name: 'Home', template: 'view/home.html'},
            { name: 'Search' , template: 'view/search.html'},
            { name: 'Map' , template: 'view/map.html'},            
            { name: 'Meeting' , template: 'view/meeting.html'},
        ];
    
    self.navItems.push({ name: 'Example', template: 'view/example.html'});
    
    self.loggedIn = false;
    
    self.selectedNavItem = self.navItems[0];        
    self.isNavItemActive = function(index) {
        return {                
            active: self.navItems[index] == self.selectedNavItem
        };
    };    
    self.changeNavItem = function(index) {             
        self.selectedNavItem = self.navItems[index];            
    };
        
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
