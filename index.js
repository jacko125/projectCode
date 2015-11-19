var express = require('express');
var nunjucks = require('nunjucks');

// Instantiate the app
var app = express();

// Configure production environment settings
if (process.env.ENVIRONMENT == 'prod') {
    console.log('Running in a production environment.');   
}

// Configure the template engine and static resources
nunjucks.configure('./src/view', {
    autoescape: true,
    express: app
});
app.use('/', express.static(__dirname + '/src/view/res'));
app.use('/view', express.static(__dirname + '/src/view'));

// Load routes
var route = require('./src/route.js')(app);

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
}); 

// Websocket server (to be refactored)
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 3001 });
wss.on('connection', function connection(ws) {
      
  var currentMsg = 'start';
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);    
    ws.send('The server received: ' + currentMsg);  
    
    if (message == 'close') {
        ws.close();
    }
    currentMsg = message;
  });
  
  ws.on('close', function close() {
    console.log('disconnected');
  });    
});
