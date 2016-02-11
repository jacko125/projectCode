miaApp.factory('wsService', ['$location', 'requestService', 'userService', 
    function($location, requestService, userService) {       
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
        
        self.webSocket = new WebSocket('ws://' + $location.host() + ":" + config.ws.port, self.token); 
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
            userService: userService,
            notifyObservers: notifyObservers
        });
                
        self.webSocket.onclose = function(event) {
            console.log('closed!');
        };
    };
    
    var disconnect = function() {
        self.webSocket.close();
    };
    
    var sendRequest = function(user, recipient) {
        console.log('Requesting location for ' + recipient);
        self.webSocket.send(JSON.stringify({                
            type: 'request',
            sender: user.Shortname,
            recipient: recipient,
            datetime: new Date(),
            data: JSON.stringify({
                senderName: user.Description                            
            })
        }));
    };

    var sendResponse = function(user, request, location) {                
        // request is a Request Message object
        removeMessage(request);            
        notifyObservers('ws-sent-response', request);         
        
        self.webSocket.send(JSON.stringify({
            type: "response",                            
            sender: user.Shortname,                
            recipient: request.sender,            
            datetime: new Date(),
            data: JSON.stringify({
                senderName: user.Description,          
                location: JSON.stringify({
                    building: location.building,
                    level: location.level,
                    latLng: JSON.stringify(location.latLng)
                })
            })            
        }));
    };
        
    var sendBroadcast = function(user, target, location) {
        // target is a StaffSearch User object
        notifyObservers('ws-sent-broadcast', target);
        console.log('sending broadcast to');
        console.log(target);
        self.webSocket.send(JSON.stringify({
            type: "broadcast",                            
            sender: user.Shortname,                
            recipient: target.Shortname,            
            datetime: new Date(),
            data: JSON.stringify({
                senderName: user.Description,          
                location: JSON.stringify({
                    building: location.building,
                    level: location.level,
                    latLng: JSON.stringify(location.latLng)
                })
            })            
        }));                
    }
   
    var removeMessage = function(message) {
        console.log('removing message')
        console.log(message);
        requestService.removeMessage(requestService, message);
        self.webSocket.send(JSON.stringify({
            type: 'remove-message',
            message: JSON.stringify(message)
        }));
    }    
    
    return {         
        registerObserverCallback: registerObserverCallback,
        connect: connect,
        disconnect: disconnect,
        
        sendRequest: sendRequest,
        sendResponse: sendResponse, 
        sendBroadcast: sendBroadcast,
        removeMessage: removeMessage
    };
}]);

function msgHandler(self, dep) {                               
    return function(event) {                
        var message = JSON.parse(event.data);                
    
        switch (message.type) {

            case 'user-login':                
                dep.userService.profile = JSON.parse(message.user);
                console.log('Received user object from server');
                console.log(dep.userService.profile);                
                break;                

            case 'message-list':
                dep.requestService.messages = message.messages;
                console.log('Received message-list, count: ' + dep.requestService.messages.length)
                console.log(dep.requestService.messages)
                dep.notifyObservers('ws-receive-message-list', dep.requestService.messages)
                break;
                
            case 'request':                
                var request = message;
                console.log('Received request for location at service level, sender: ' + request.sender);
                console.log(request);
                dep.requestService.removeMessage(dep.requestService, request)
                dep.requestService.messages.push(request)                
                dep.notifyObservers('ws-receive-request', request);                
                break;
                                
            case 'response':                              
                var response = message;                               
                console.log('Received response at service level, sender: ' + response.sender);                
                console.log(response);     
                dep.requestService.removeMessage(dep.requestService, response)
                dep.requestService.messages.push(response) // Only one response from someone at any given time                
                dep.notifyObservers('ws-receive-response', response);
                break;
            
            case 'broadcast':
                var broadcast = message;
                console.log('Received broadcast at service level, sender: ' + broadcast.sender);                
                console.log(broadcast);     
                dep.requestService.removeMessage(dep.requestService, broadcast)
                dep.requestService.messages.push(broadcast) // Only one broadcast from someone at any given time                
                dep.notifyObservers('ws-receive-broadcast', broadcast.data);
                                                
            default:
                console.log('Received unknown message');        
                console.log(message);
        }
    };
}