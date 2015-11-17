var express = require('express');
var nunjucks = require('nunjucks');
var util = require('util');

// Instantiate the app
var app = express();

// Configure the template engine
nunjucks.configure('./src/view', {
    autoescape: true,
    express: app
});
app.use('/', express.static('./src/view/res'));
app.use('/view', express.static('./src/view'));

// Load routes
var route = require('./src/route.js')(app);


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
}); 

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 3001 });

wss.on('connection', function connection(ws) {
      
  var currentMsg = 'start';
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);    
    
    if (message == 'close') {
        ws.close();
    }
    currentMsg = message;
  });
  
  ws.on('close', function close() {
    console.log('disconnected');
  });

    ws.send('Returning: ' + currentMsg);  
});



