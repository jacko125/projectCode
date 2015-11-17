var express = require('express');
var nunjucks = require('nunjucks');

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

// var view = {	
	// name: 'Henry'
// }
// app.get('/', function (req, res) {
  // res.render('home.html', view);
// });

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
