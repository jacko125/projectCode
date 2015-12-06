miaApp.factory('wsService', ['$location', 'requestService', 
    function($location, requestService) {       
    var self = this;
    
    self.webSocket = {};
    self.username = {};
    self.token = {};    
    
    var observerCallbacks = [];
    var registerObserverCallback = function(callback) {
        observerCallbacks.push(callback);
    };    
    var notifyObservers = function(event, data) {
        observerCallbacks.forEach(function(callback) {
            callback(event, data);
        });
    }
    
    var connect = function($scope, username, token) {
        self.token = token;
        self.username = username;
        
        self.webSocket = new WebSocket('ws://' + $location.host() + ':3001', self.token); 
        self.webSocket.onopen = function(event) {            
            console.log('connection opened. sending connect packet...');
            self.webSocket.send(JSON.stringify({
                type: 'connect',
                sender: self.username,
                token: self.token
            }));
        };
        
        self.webSocket.onmessage = msgHandler(self,
        {                        
            requestService: requestService,
            notifyObservers: notifyObservers
        });
                
        self.webSocket.onclose = function(event) {
            console.log('closed!');
        };
    };
    
    var disconnect = function() {
        self.webSocket.close();
    };
    
    var requestLocation = function(sender, recipient) {
        console.log('Requesting location for ' + recipient);
        self.webSocket.send(JSON.stringify({
            type: 'request-location',
            request: JSON.stringify({
                sender: sender,
                recipient: recipient,
                datetime: new Date()                
            })
        }));
    };

    var sendResponse = function(sender, recipient, location) {        
        requestService.removeRequest(requestService, recipient);        
        notifyObservers('ws-sent-response', recipient);
        self.webSocket.send(JSON.stringify({
            type: "respond-location",
            response: JSON.stringify({
                sender: sender,
                recipient: recipient,
                location: location, //building, floor, coords
                datetime: new Date()
            })
        }));
    };
    
    return {         
        registerObserverCallback: registerObserverCallback,
        connect: connect,
        disconnect: disconnect,
        
        requestLocation: requestLocation,
        sendResponse: sendResponse,        
    };
}]);

function msgHandler(self, dep) {                               
    return function(event) {        
        var message = JSON.parse(event.data);
    
        switch (message.type) {                            
            case 'response-list':                
                dep.requestService.responses = message.responses;
                console.log('Received response-list at service level, count: ' + dep.requestService.responses.length);                                
                dep.notifyObservers('ws-receive-response-list', dep.requestService.responses);
                break;  

            case 'request-list':                                
                dep.requestService.requests = message.requests;                
                console.log('Received request-list at service level, count: ' + dep.requestService.requests.length);                                
                dep.notifyObservers('ws-receive-request-list', message.requests);
                break;                
                
            case 'request-location':                
                var request = JSON.parse(message.request);                                
                console.log('Received request for location at service level, sender: ' + request.sender);
                console.log(request);
                addRequest(dep.requestService, request);
                dep.notifyObservers('ws-receive-request', request);                
                break;
                                
            case 'response':
                console.log('Received response at service level, sender: ' + message.sender);
                var response = JSON.parse(message.response);
                console.log(response);
                responses.push(response);
                dep.requestService.responses.push(response);
                dep.notifyObservers('ws-receive-response', response);
                break;
                
            default:
                console.log('Received unknown message');        
                console.log(message);
        }
    };
}
function addRequest(requestService, newRequest) {            
    var updated = false;
    for (var i = 0; i < requestService.requests.length; i++) {
        if (requestService.requests[i].sender === newRequest.sender) {
            requestService.requests[i].datetime = newRequest.datetime;
            updated = true;
        }
    }
    if (!updated) {
        requestService.requests.push(newRequest);
    }
}

