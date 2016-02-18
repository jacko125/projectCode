miaApp.factory('requestService', [function() {
               
    var messages = [];                   
    
    var removeMessage = 
        function(requestService, message) {
            var indexToRemove = -1;
            // Remove duplicate messages based on type/sender 
            for (var i = 0; i < requestService.messages.length; i++) {                
                var currentMsg = requestService.messages[i];
                if (currentMsg.type == message.type && currentMsg.sender == message.sender) {
                    indexToRemove = i;                           
                }
            }
            if (indexToRemove != -1) {
                requestService.messages.splice(indexToRemove, 1);
            }            
        }       
    
    return {
        removeMessage: removeMessage, // static        
        
    };
    
}]);