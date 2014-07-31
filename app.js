// beglobal api key ZrlNkRgRkQke3sbr7hDUIQ%3D%3D
// curl -X POST -H "Content-type: application/json" -H "Authorization: LC apiKey=<YOUR API KEY>" -d '{"text":"Hello Developers", "from":"eng", "to":"fra"}' https://lc-api.sdl.com/translate
var express = require('express');
var bodyParser = require('body-parser');
var BeGlobal = require('node-beglobal');
var randomWords = require('random-words');
var model = require('./models/model.js');
var mongoose = require('mongoose');

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
app.post('/translate', function(req, res) {
	beglobal.translations.translate(
	  {text: req.body.text, from: req.body.from, to: req.body.to},
	  function(err, results) {
	    if (err) {
	      return console.log('hello1', err);
	    }

	    console.log(results);
	    res.render('index', {
	    	translation: results})
	  });
});


app.get('/quiz', function(req,res) {
	res.render('quiz');
})

// used when language to translate from is choosen on quiz page
app.post('/setLanguage', function(req, res) {
	var word = randomWords();
	// console.log(word)
	beglobal.translations.translate(
	  {text: word, from: 'eng', to: req.body.quizLanguage}, function(err, results) {
	    if (err) {
	      return console.log('hello',err);
	    }

	    console.log("results:", results);
	    model.createQuestion(results.to, results.from, results.translation, word);
		res.render('quiz', {
			aWord: results.translation,
			quizLanguage: req.body.quizLanguage
		})

	 	}
	);	
})

app.post("/quizResponse", function(req, res){
	// console.log("submited word: ", req.body.quizAnswer);
	model.User.find({id: 0}, function(error, user) {
		if(error) {
			console.log('Not found in quiz response')
		}else {
			console.log("User info:", user)
			console.log("req.body.answer:", req.body.answer)
			if(user[0].questions[user[0].currentQuestion].answer === req.body.answer) {
					res.send('Correct')
			}
			else {
				console.log('Wrong')
			}
		}
	})

})

var server = app.listen(3157, function() {
	console.log('Express server listening on port ' + server.address().port);
});
