var http = require('http');
var WebSocketServer = require('ws').Server;
var logger = require('winston');
var jwt = require('jsonwebtoken');
var util = require('util');

var config = require('./resources/config.json');
var wsModule = require('./src/model/module/WsModule.js');
var MessageModule = require('./src/model/module/MessageModule.js');
var UserModule = require('./src/model/module/UserModule.js');

// Configure logging subsystem (winstonjs)
logger.level = (config.env == 'dev') ? 'debug' : 'info';
logger.add(require('winston-daily-rotate-file'),
{
    filename: __dirname + '/data/logs/mia_ws.log',
    datePattern: '.yyyy-MM-dd.log',
    json: false
});

var wss = new WebSocketServer(
{
    port: config.ws.port,
    verifyClient: function(info) {          
                
        try {            
            var token = info.req.headers['sec-websocket-protocol'];
            var decoded = jwt.verify(token, 'secret');
            logger.info('Authenticated ws connection (token=%s)', token);
            return true;
        } catch(err) {
            logger.warn('Unauthenticated ws connection', info.req.headers);    
            return false;
        }                
    }        
});

wss.on('connection', function connection(ws) {     
    
    ws.on('message', function incoming(event) {
        var message = JSON.parse(event);
        logger.info('Received message',message);
        wsModule.handleMsg(wss, ws, message);    
    });
  
    ws.on('close', function close() {   
        logger.info('Disconnected user (username=%s)', ws.username);
    });    
  
}); 

setInterval(function() {
    MessageModule.flushMessages();
    UserModule.flushUserDefaultLocs();        
}, 30 * 60 * 1000)

logger.info("MIA websocket server listening on ws://" + config.ws.host + ":" + config.ws.port);