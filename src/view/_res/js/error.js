miaApp.controller('errorController', [
    '$http', '$window', '$scope','$rootScope', '$state', '$stateParams',    
    function($http, $window, $scope, $rootScope, $state, $stateParams) {   
             
        var self = this;


        self.errorType = $stateParams.type;
     
        
    }
]);

