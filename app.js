// beglobal api key ZrlNkRgRkQke3sbr7hDUIQ%3D%3D
// curl -X POST -H "Content-type: application/json" -H "Authorization: LC apiKey=<YOUR API KEY>" -d '{"text":"Hello Developers", "from":"eng", "to":"fra"}' https://lc-api.sdl.com/translate
var express = require('express');
var bodyParser = require('body-parser');
var BeGlobal = require('node-beglobal');
var randomWords = require('random-words');
var model = require('./models/model.js');
var mongoose = require('mongoose');
var controller = require('./controllers/controller.js')

var beglobal = new BeGlobal.BeglobalAPI( {
	api_token: 'ZrINkRgRkQke3sbr7hDUlQ%3D%3D'
});

//  // used to get list of all language pairs. Saved in beglobal_lang_pairs.txt
// beglobal.languages.all(
//   function(err, results) {
//     if (err) {
//       return console.log(err);
//     }

//     console.log(results);
//   }
// );

mongoose.connect('mongodb://localhost/lingo');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
	res.render('index');
});

// used for main page translation service
app.post('/translate', controller.translate);


app.get('/quiz', controller.quiz);

// used when language to translate from is choosen on quiz page
app.post('/setLanguage', controller.setLanguage)

app.post('/quizResponse', controller.quizResponse)


/*app.post("/quizResponse", function(req, res){
	// console.log("submited word: ", req.body.quizAnswer);
	model.User.findOne({id: 0}, function(error, user) {
		if(error) {
			console.log('Not found in quiz response')
		}else {
			console.log("User info:", user)

			if(user.questions[user.currentQuestion].answer === req.body.answer) {
					res.send('Correct')
			}
			else {
				console.log('Wrong')
			}
		}
	})

})*/

var server = app.listen(3157, function() {
	console.log('Express server listening on port ' + server.address().port);
});
