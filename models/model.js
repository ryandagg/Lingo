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

// // resets the database on save for testing purposes
// User.remove({}, function() {
// 	user0.save();
	
// });

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
}

var createQuiz = function(callBack) {
	var newQuiz = new Quiz();
	User.findOneAndUpdate({id: 0}, {$push: {quizzes: newQuiz}, $inc: {currentQuiz: 1}}, function(err, user){
		if(err){
			console.log('createQuiz failed');
		}else{
			console.log("newQuestion:", newQuiz)
		}
		console.log("arguments:", arguments)
		if(callBack) {
			callBack(false, user.quizzes.length)
		}
	})
}

var fuzzyAnswerCheck = function(answer, response) {
	var offBy = 0;
	response = response.toLowerCase();
	if(Math.abs(answer.length - response.length) > 1){
		return false;
	}
	else if(Math.abs(answer.length - response.length) === 1){
		console.log("length off triggered")
		for(var j = 0; j < answer.length; j++){
			if(answer[j] !== response[j]){
				console.log("mistake triggered");
				// check ahead in answer to see if response is missing a letter
				if(answer[j + 1] === response[j]) {
					response = response.slice(0, j) + " " + response.slice(j);
					break;
				}
				// check ahead to check for extra letter
				else if(answer[j] === response[j + 1]) {
					offBy++;
					console.log("too many else if");
					response = response.slice(0, j) + response.slice(j + 1);
					break;
				}
				else{
					return false;
				}
			}
		}
	}
	console.log("response:", response)
	for(var i = 0; i < answer.length; i++){
		if(answer[i] !== response[i]){
			offBy++;
		}
	}
	console.log("offBy:", offBy);
	return offBy < 2;
}

module.exports = {
	Question: Question,
	createQuestion: createQuestion,
	User: User,
	fuzzyAnswerCheck: fuzzyAnswerCheck,
	createQuiz: createQuiz
};