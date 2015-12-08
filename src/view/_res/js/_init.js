// Declare the app module
var miaApp = angular.module('mia', ['ui.router', 'angular-loading-bar', 'ngToast']);

miaApp.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', 
    function($httpProvider, $stateProvider, $urlRouterProvider) { 
        $httpProvider.interceptors.push('authInterceptor');        
        
        $urlRouterProvider.otherwise("/home");
        
        var homeCtrl = 'homeController as homeCtrl';
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'view/home/home.html',
                controller: homeCtrl
            })
            .state('login', {                
                templateUrl: 'view/home/login.html',
                controller: homeCtrl
            });
                        
        $stateProvider
            .state('search', {
                url: '/search',
                templateUrl: 'view/search/list.html',
                controller: 'searchController as searchCtrl'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'view/search/profile.html',
                controller: 'searchController as searchCtrl',
                params: { profile: null }
            });
                   
        $stateProvider
            .state('map', {
                url: '/map',
                templateUrl: 'view/map/map.html',
                controller: 'mapController as mapCtrl',
                params: { action: null, target: null }
            });
        $stateProvider
            .state('requests', {
                templateUrl: 'view/request/request.html',
                controller: 'requestController as requestCtrl',
                params: { action: null }
            });
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