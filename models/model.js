var BeGlobal = require('node-beglobal');
var randomWords = require('random-words');
var mongoose = require('mongoose');

var beglobal = new BeGlobal.BeglobalAPI( {
	api_token: 'ZrINkRgRkQke3sbr7hDUlQ%3D%3D'
});

var Question = mongoose.model('Question', {
	from: String,
	to: String,
	text: String,
	questionNumber: Number,
	quizNumber: Number,
	isCorrect: Boolean,
})

	module.exports = { Question: Question };