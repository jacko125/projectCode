var http = require('http');
var WebSocketServer = require('ws').Server;
var wsModule = require('./src/model/module/WsModule.js');
var jwt = require('jsonwebtoken');

var util = require('util');

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
        
        try {
          var decoded = jwt.verify(info.req.headers['sec-websocket-protocol'], 'secret');                    
        } catch(err) {
            return false;
        }
        
        return true;
    }        
});

wss.on('connection', function connection(ws) {     
    
    ws.on('message', function incoming(event) {
        var message = JSON.parse(event);
        console.log('incoming object: ' + util.inspect(message));
        wsModule.handleMsg(wss, ws, message);    
    });
  
  ws.on('close', function close() {
    console.log('disconnected');
  });    
});