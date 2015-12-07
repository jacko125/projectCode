miaApp.factory('requestService', [function() {
    
    var requests = [];    
    var responses = [];
    
    return {
        
        removeRequest: function(requestService, sender) {            
            var indexToRemove = -1;
            for (var i = 0; i < requestService.requests.length; i++) {        
                if (requestService.requests[i].sender === sender) {
                    indexToRemove = i;               
                }
            }
            if (indexToRemove != -1) {
                requestService.requests.splice(indexToRemove, 1);
            }            
        },        
        //Static function
        removeResponse: function removeResponse(requestService, sender) {            
            var indexToRemove = -1;
            for (var i = 0; i < requestService.responses.length; i++) {        
                if (requestService.responses[i].sender === sender) {
                    indexToRemove = i;          
                }
            }
            if (indexToRemove != -1) {
                requestService.responses.splice(indexToRemove, 1);
            }            
        }
        
    };
    
}]);
