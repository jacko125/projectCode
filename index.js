var config = require('./src/config.json');
var express = require('express');

var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');

// Instantiate the app
var app = express();

// Configure production environment settings
if (process.env.ENVIRONMENT === 'prod') {
    console.log('Running in a production environment.'); 
}

// Configure the template engine and static resources
nunjucks.configure('./src/view', {
    autoescape: true,
    express: app
});
app.use('/', express.static(__dirname + '/src/view/_res'));
app.use('/view', express.static(__dirname + '/src/view'));
app.use('/maps', express.static(__dirname + '/data/maps'));

// Configure router-level middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Load routes
require('./src/route.js')(app);

// Start HTTP server
var server = app.listen(config.mia-port, function () {
  console.log('MIA listening at http://%s:%s', server.address().address, server.address().port);
});
