miaApp.registerFactory('wsService', ['$http', function($http) {       
    var self = this;
    self.webSocket = {};
    self.username = {};
    self.token = {};
    

    var connect = function(username, token) {
        self.token = token;
        self.username = username;
        
        self.webSocket = new WebSocket("ws://localhost:3001", self.token); 
        self.webSocket.onopen = function(event) {            
            console.log('connection opened. sending connect packet...');
            self.webSocket.send(JSON.stringify(
            {
                type: 'connect',
                username: self.username,
                token: self.token
            }));
        };
        
        self.webSocket.onmessage = msgHandler;
        
        //self.webSocket.onmessage = self
        self.webSocket.onclose = function(event) {
            console.log('closed!');
        };
    }

    return { 
        connect: connect        
    };
}]);

function msgHandler(event) {
    console.log('Received message: ' + event.data);
}