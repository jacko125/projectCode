miaApp.factory('requestService', [function() {
               
    var messages = [];                   
    
    var removeMessage = 
        function(requestService, message) {
            var indexToRemove = -1;
            // Remove duplicate messages based on type/sender 
            for (var i = 0; i < requestService.messages.length; i++) {                
                var currentMsg = requestService.messages[i]
                console.log('iterating...');
                console.log(currentMsg);     
                console.log(message);
                if (currentMsg.type == message.type && currentMsg.sender == message.sender) {
                    indexToRemove = i;       
                    console.log('found and removing');
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