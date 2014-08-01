var express = require('express');
var bodyParser = require('body-parser');
var BeGlobal = require('node-beglobal');
var randomWords = require('random-words');
var model = require('../models/model.js');
var mongoose = require('mongoose');

var beglobal = new BeGlobal.BeglobalAPI( {
	api_token: 'ZrINkRgRkQke3sbr7hDUlQ%3D%3D'
});



var controller = {
	quizResponse: function(req, res){
		console.log("controller quizResponse req.body: ", req.body);
		// find the correct user in db
		model.User.findOne({id: 0}, function(error, user) {
			if(error) {
				console.log('Not found in quiz response. controller.quizResponse')
			}else {
				// logging for testing purposes
				console.log("User info:", user)

				// flag to send to client for rendering if their response was accurate.
				var isCorrect;
				// stored current word to send to client/jQueary
				var previousWord = user.questions[user.currentQuestion].answer

				// if wrong answer given to question
				if(user.questions[user.currentQuestion].answer !== req.body.answer)  {
					isCorrect = "Wrong";
					// push a 'false' to quizzes boolList
					user.quizzes[user.currentQuiz].boolList.push(false);
					user.markModified('quizzes');
					user.save();

					// helper var to make following if conditional easier to read. It access the current quiz quiz in the user
					var boolListInUser = user.quizzes[user.currentQuiz].boolList

					// check if the last 2 questions were also wrong
					if (boolListInUser.length > 2 
						&& !boolListInUser[boolListInUser.length - 1] 
						&& !boolListInUser[boolListInUser.length - 2] 
						&& !boolListInUser[boolListInUser.length - 3]) {
						// start new quiz
						console.log("You suck");
					}
					else if(boolListInUser.length === 10){
						// starte new quiz
					}
				}
				// if the answer is correct
				else{
					user.questions[user.currentQuestion].isCorrect = true;
					user.markModified('questions');
					user.quizzes[user.currentQuiz].boolList.push(true);
					user.markModified('quizzes');
					user.save();
					isCorrect = "Correct"
				}
			}
					// send string to main.js to update html
			model.createQuestion(user.questions[user.currentQuestion].from, function(err, newWord){
				// ajax change quiz page
				// console.log("newWord - controller quizResponse:", newWord)
				res.send({
					correct: isCorrect,
					translateThis: newWord.text,
					lastWord: previousWord
				})
			});
		})
	},

	setLanguage: function(req, res) {
		// var word = randomWords();
		// console.log(word)
		// beglobal.translations.translate(
		//   {text: word, from: 'eng', to: req.body.quizLanguage}, function(err, results) {
		//     if (err) {
		//       return console.log('hello',err);
		//     }

		//     // console.log("results:", results);
		//     model.createQuestion(results.to, results.from, results.translation, word);
		model.createQuestion(req.body.quizLanguage, function(err, newWord){
			if(err){
				console.log("controller.js setLanguage fail")
			}else{
				res.render('quiz', {
					aWord: newWord.text,
					quizLanguage: req.body.quizLanguage
				})
			};
		})
	},

	translate: function(req, res) {
		beglobal.translations.translate(
		  {text: req.body.text, from: req.body.from, to: req.body.to},
		  function(err, results) {
		    if (err) {
		      return console.log('controller.translate error:', err);
		    }

		    console.log('controller.translate reuslts:', results);
		    res.render('index', {
		    	translation: results})
		  });
	},

	quiz: function(req,res) {
		model.createQuiz();
		res.render('quiz');
	}
}

module.exports = controller;