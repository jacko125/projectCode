var express = require('express');
var nunjucks = require('nunjucks');
var soap = require('soap');

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

  var url = 'http://staffdirectory.pc.internal.macquarie.com/WebServices/SearchService.svc?wsdl';
  var args = {name: 'Jackson chan'};
  soap.createClient(url, function(err, client) {
      client.staffSearch(args, function(err, result) {
          console.log(result);
      });
  });



var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
