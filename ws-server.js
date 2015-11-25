// Websocket server (to be refactored)
var util = require('util');
var http = require('http');
var WebSocketServer = require('ws').Server;
var wsModule = require('./src/model/module/wsModule.js');
var wss = new WebSocketServer(
{
    port: 3001,
    verifyClient: function(info) {          
        console.log('verifying client...');
        var hostname = 'localhost';
        if (process.env.ENVIRONMENT == 'prod') {
            hostname = 'ntsydv1946';
        }                        
        console.log(util.inspect(info.req.headers));        
        return (info.req.headers['sec-websocket-protocol'] == 'TGP.MIA.ws');
    }
    
});

wss.on('connection', function connection(ws) {
    console.log('opened connection');    
    
    ws.on('message', function incoming(event) {
        var message = JSON.parse(event);
        console.log('incoming object: ' + util.inspect(message));
        console.log('handling message from ' + message.username);
        wsModule.handleMsg(ws, message);    
    });
  
  ws.on('close', function close() {
    console.log('disconnected');
  });    
});