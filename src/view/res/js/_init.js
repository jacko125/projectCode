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