// Storage-agnostic interface for User objects.
var http = require('http');

module.exports = {
	
    handleMsg: function(ws, message) {        
        switch (message.type) {
            case 'connect':
                console.log('received connection from ' + message.username);
                ws.send(message.username + ' has connected! Token: ' + message.token);
                break;            
        }
    }	
}

function getRequest() {
                   
        http.get({
                host: 'localhost',
                port: 3000,
                path: '/wsauth',
                headers: {
                    'Authorization' : 'Bearer ' + info.req.headers['sec-websocket-protocol']   
                }
            }, function(response) {
                console.log('Status ' + response.statusCode);                
            });
}