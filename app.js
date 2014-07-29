// beglobal api key ZrlNkRgRkQke3sbr7hDUIQ%3D%3D
// curl -X POST -H "Content-type: application/json" -H "Authorization: LC apiKey=<YOUR API KEY>" -d '{"text":"Hello Developers", "from":"eng", "to":"fra"}' https://lc-api.sdl.com/translate
var express = require('express');
var bodyParser = require('body-parser');
var BeGlobal = require('node-beglobal');

var beglobal = new BeGlobal.BeglobalAPI( {
	api_token: 'ZrINkRgRkQke3sbr7hDUlQ%3D%3D'
});

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
	res.render('index');
});

app.post('/translate', function(req, res) {
	beglobal.translations.translate(
	  {text: req.body.text, from: req.body.from, to: req.body.to},
	  function(err, results) {
	    if (err) {
	      return console.log(err);
	    }

	    console.log(results);
	    res.render('index', {
	    	translation: results})
	  });
});

var server = app.listen(3157, function() {
	console.log('Express server listening on port ' + server.address().port);
});
