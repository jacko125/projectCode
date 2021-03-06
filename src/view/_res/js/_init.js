// Declare the app module
var miaApp = angular.module('mia', ['ui.router', 'angular-loading-bar', 'ngToast']);
    
miaApp.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', 'ngToastProvider', 
    function($httpProvider, $stateProvider, $urlRouterProvider, ngToastProvider) { 
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
                url: '/login',
                templateUrl: 'view/home/login.html',
                controller: homeCtrl,
                params: { login: null }
            })
            .state('about', {
                url: '/about',
                templateUrl: 'view/home/about.html'                              
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
                params: { action: 'profile', profile: null }
            });
                   
        $stateProvider
            .state('map', {
                url: '/map?link&linkLocation',
                templateUrl: 'view/map/map.html',
                controller: 'mapController as mapCtrl',
                params: { action: null, target: null }
            });
        $stateProvider
            .state('notifications', {
                templateUrl: 'view/notification/list.html',
                controller: 'notificationController as notifyCtrl'                
            });
        $stateProvider
            .state('meeting', {
                url: '/meeting',
                templateUrl: 'view/meeting/search.html',
                controller: 'meetingController as meetingCtrl'                
            });
        $stateProvider
            .state('user', {
                url: '/user',
                templateUrl: 'view/user/profile.html',
                controller: 'userController as userCtrl'                
            });
        $stateProvider
            .state('error', {   
                templateUrl: 'view/error/error.html',
                controller: 'errorController as errorCtrl',
                params: { errorCode: null }
            });
           
            
        ngToastProvider.configure({            
            horizontalPosition: 'right',            
            animation: 'fade',
            maxNumber: 3,
            timeout: 2500,
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