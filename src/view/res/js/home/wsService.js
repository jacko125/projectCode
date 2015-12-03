miaApp.registerFactory('wsService', ['$rootScope', function($rootScope) {       
    var self = this;
    self.webSocket = {};
    self.username = {};
    self.token = {};    
    
    self.requests = [];

    var connect = function($scope, username, token) {
        self.token = token;
        self.username = username;
        
        self.webSocket = new WebSocket("ws://localhost:3001", self.token); 
        self.webSocket.onopen = function(event) {            
            console.log('connection opened. sending connect packet...');
            self.webSocket.send(JSON.stringify({
                type: 'connect',
                sender: self.username,
                token: self.token
            }));
            
            self.webSocket.send(JSON.stringify({
                type: 'get-requests',
                sender: username         
            }));
            
            self.webSocket.send(JSON.stringify({
                type: 'get-responses',
                recipient: username         
            }));
        };
        
        self.webSocket.onmessage = msgHandler(self,
        {
            $scope: $scope, // Passed in
            $rootScope: $rootScope // Injected
        });
                
        self.webSocket.onclose = function(event) {
            console.log('closed!');
        };
    }
    
    var disconnect = function() {
        self.webSocket.close();
    }
    
    var requestLocation = function(sender, recipient) {
        console.log('requesting location for ' + recipient);
        self.webSocket.send(JSON.stringify({
            type: 'request-location',
            sender: sender,
            recipient: recipient,
            datetime: new Date()
        }));
    }

    var sendResponse = function(sender, recipient, location) {
        self.webSocket.send(JSON.stringify({
            type: "respond-location",
            sender: sender,
            recipient: recipient,
            location: location, //building, floor, coords
            datetime: new Date(),            
        }));
    }
    
    var getRequests = function(username) {

    }

    return { 
        connect: connect,
        disconnect: disconnect,
        requestLocation: requestLocation,
        sendResponse: sendResponse,
        getRequests: getRequests,       
        requests: self.requests
    };
}]);

function msgHandler(self, dep) {                               
    return function(event) {        
        var message = JSON.parse(event.data);
        console.log(message);
    
        switch (message.type) {
            //"requests"
            case 'request-list':
                console.log('Received request list.');
                console.log(message.requests);
                dep.$rootScope.requests = message.requests;
                dep.$scope.$emit('ws-receive-request-list', message.requests);
                break;                            
                                
            case 'response':
                console.log('Received response.');                
                dep.$scope.$emit('ws-receive-response', message.response); 
                break;
                
            case 'response-list':
                console.log('Received response list.');
                console.log(message.responses);
                dep.$rootScope.responses = message.responses;
                dep.$scope.$emit('ws-receive-response-list', message.responses);
                break;
            
            default:
                console.log('Received message: ' + event.data);        
        };
    };    
}