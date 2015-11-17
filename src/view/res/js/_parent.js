// Declare the app module
var miaApp = angular.module('mia', []);

miaApp.config(['$controllerProvider', '$provide', function($controllerProvider, $provide) { 
    miaApp.registerCtrl = $controllerProvider.register;
    miaApp.registerFactory = $provide.factory;
}]);

miaApp.controller('parentController', 
    ['$location', function($location) {                
    var self = this;               
    self.navItems = [
            { name: 'Home', template: 'view/home.html'},
            { name: 'Search' , template: 'view/search.html'},
            { name: 'Map' , template: 'view/map.html'},            
            { name: 'Meeting' , template: 'view/meeting.html'},
        ];
    
    self.navItems.push({ name: 'Example', template: 'view/example.html'});
    
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
