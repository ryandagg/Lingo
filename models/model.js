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

})

var user0 = new User({
	questions: [],
	currentQuestion: -1,
	id: 0
})
User.remove({}, function() {
	user0.save();
	
});



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

var createQuestion = function(to, from, text, answer) {
	var newQuestion = new Question(to, from, text, answer);
	User.findOneAndUpdate({id: 0}, {$push: {questions: newQuestion}, $inc: {currentQuestion: 1}}, function(err, data){
		if(err){
			console.log('createQuestion failed');
		}else{
			console.log("newQuestion:", newQuestion)
			
		}
		
	})
	
}

module.exports = {
	Question: Question,
	createQuestion: createQuestion,
	User: User
};