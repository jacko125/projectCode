var config = require('./resources/config.json');
var express = require('express');
var favicon = require('serve-favicon');

var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');

// Instantiate the app
var app = express();

// Configure the template engine and static resources
nunjucks.configure(__dirname + '/src/view', {
    autoescape: true,
    express: app
});
app.use('/', express.static(__dirname + '/src/view/_res'));
app.use('/view', express.static(__dirname + '/src/view'));
app.use('/maps', express.static(__dirname + '/data/maps'));
app.use(favicon(__dirname + '/src/view/_res/img/favicon.ico'));



// Configure router-level middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Load routes
require('./src/route.js')(app);

// Start HTTP server
var server = app.listen(config.mia.port, function () {
  console.log('MIA listening at http://%s:%s', server.address().address, server.address().port);
});
