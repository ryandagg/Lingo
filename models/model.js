var BeGlobal = require('node-beglobal');
var randomWords = require('random-words');
var mongoose = require('mongoose');

var beglobal = new BeGlobal.BeglobalAPI( {
	api_token: 'ZrINkRgRkQke3sbr7hDUlQ%3D%3D'
});

var User = mongoose.model("User", {
	questions: Array,
	currentQuestion: Number,
	id: Number,
	quizzes: Array,
	currentQuiz: Number
})

var user0 = new User({
	questions: [],
	currentQuestion: -1,
	id: 0,
	currentQuiz: -1,
	quizzes: []
})

// resets the database on save for testing purposes
User.remove({}, function() {
	user0.save();
	
});

var Quiz = function() {
	this.passed = false;
	this.boolList = []
}

var Question = function(from, to, text, answer) {
	this.from = from;
	this.to= to;
	this.text= text;
	// questionNumber: Number,
	// quizNumber: Number,
	this.isCorrect= false;
	this.answer = answer
	// currentQuestion: Boolean
}

var createQuestion = function(language, func) {
	var word = randomWords();
	beglobal.translations.translate(
		  {text: word, from: 'eng', to: language}, function(err, results) {
	    if (err) {
	    	console.log('model.createQuestion err',err);
	    }else{
	    	var newQuestion = new Question(results.to, results.from, results.translation, word);
			User.findOneAndUpdate({id: 0}, {$push: {questions: newQuestion}, $inc: {currentQuestion: 1}}, function(err, data){
				if(err){
					console.log('createQuestion failed');
				}else{
					console.log("newQuestion:", newQuestion);
				}
			})
			// console.log("newQuestion line 66:", newQuestion)
			// sends info to cb from request
			func(false, newQuestion);
	    }
	});	
	// var newQuestion = new Question(results.to, results.from, results.translation, word);
	// User.findOneAndUpdate({id: 0}, {$push: {questions: newQuestion}, $inc: {currentQuestion: 1}}, function(err, data){
	// 	if(err){
	// 		console.log('createQuestion failed');
	// 	}else{
	// 		console.log("newQuestion:", newQuestion)
			
	// 	}
		
	// })
	// var newQuestion = new Question(to, from, text, answer);
	// User.findOneAndUpdate({id: 0}, {$push: {questions: newQuestion}, $inc: {currentQuestion: 1}}, function(err, data){
	// 	if(err){
	// 		console.log('createQuestion failed');
	// 	}else{
	// 		console.log("newQuestion:", newQuestion)
			
	// 	}
		
	// })
		// console.log(word)
		// beglobal.translations.translate(
		//   {text: word, from: 'eng', to: req.body.quizLanguage}, function(err, results) {
		//     if (err) {
		//       return console.log('hello',err);
		//     }

		//     // console.log("results:", results);
		//     model.createQuestion(results.to, results.from, results.translation, word);
		// 	res.render('quiz', {
		// 		aWord: results.translation,
		// 		quizLanguage: req.body.quizLanguage
		// 	})
		// });	
	
}

var createQuiz = function() {
	var newQuiz = new Quiz();
	User.findOneAndUpdate({id: 0}, {$push: {quizzes: newQuiz}, $inc: {currentQuiz: 1}}, function(err, data){
		if(err){
			console.log('createQuiz failed');
		}else{
			console.log("newQuestion:", newQuiz)
		}
	})
}

module.exports = {
	Question: Question,
	createQuestion: createQuestion,
	User: User,
	createQuiz: createQuiz
};