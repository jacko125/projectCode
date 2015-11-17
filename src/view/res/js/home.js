miaApp.registerCtrl('homeController', [function() { 
        var self = this;        
        
        self.title = 'Home';
        self.message = 'This page allows you to log into the MIA service';
        
        self.wsMsg = 'testData';
        
        var exampleSocket = new WebSocket("ws://localhost:3001"); 
        exampleSocket.onopen = function(event)
        {
            console.log('opened!');                            
        };
        
        exampleSocket.onclose = function(event)
        {
            console.log('closed!');
        }
        
        self.testButtonClick = function (event) {
            
            switch (event) {
                case 'open':    
                    exampleSocket = new WebSocket("ws://localhost:3001"); 
                            exampleSocket.onopen = function(event)
        {
            console.log('opened!');                            
        };
        
        exampleSocket.onclose = function(event)
        {
            console.log('closed!');
        }
                    break;
                case 'send':                     
                     exampleSocket.send(self.wsMsg);
                     console.log('sent ' + self.wsMsg);
                    break;
                case 'close':
                    exampleSocket.close();
                    break;                         
            }
        }
                                   

                      
}]);