// Storage-agnostic interface for User objects.
var http = require('http');

module.exports = {
	
    handleMsg: function(wss, ws, message) {
        console.log('incoming message read: ' + require('util').inspect(message));
        switch (message.type) {
            case 'connect':
                console.log('received connection from ' + message.username);
                ws.send(message.username + ' has connected! Token: ' + message.token);
                
                ws.name = message.username;
                                                
                wss.clients.forEach(function each(client) {
                    console.log('found name: ' + client.name);
                    console.log(require('util').inspect(client));
                    client.send("Someone has joined: " + message.username);
                });
                
                break;            
        }
    }	
}