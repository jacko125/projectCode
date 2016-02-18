miaApp.controller('errorController', [
    '$http', '$window', '$scope','$rootScope', '$state', '$stateParams', 
    'errorService',
    function($http, $window, $scope, $rootScope, $state, $stateParams,
             errorService) {   
             
        var self = this;


        self.errorMessage = errorService.getErrorMessageByCode($stateParams.errorCode);       
        
        
        
     
        
    }
]);

