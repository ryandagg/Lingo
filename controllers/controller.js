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
		console.log("submited word: ", req.body.quizAnswer);
		model.User.findOne({id: 0}, function(error, user) {
			if(error) {
				console.log('Not found in quiz response')
			}else {
				console.log("User info:", user)
				// If question is answered correctly
				// if wrong answer given to question
				if(user.questions[user.currentQuestion].answer !== req.body.answer)  {
					res.send('Wrong')
					user.quizzes[user.currentQuiz].boolList.push(false);

					// check if the last 2 questions were also wrong
					if (user.quizzes[user.currentQuestion].boolList.length > 2 && !user.quizzes[user.currentQuestion].boolList[user.quizzes[user.currentQuestion].boolList.length - 1] && !user.quizzes[user.currentQuestion].boolList[user.quizzes[user.currentQuestion].boolList.length - 2] && user.quizzes[user.currentQuestion].boolList[user.quizzes[user.currentQuestion].boolList.length - 3]) {
						// start new quiz
						console.log("You suck");
					}
				}
				else{
					user.questions[user.currentQuestion].isCorrect = true;
					user.markModified('questions');
					user.quizzes[user.currentQuestion].boolList.push(true);
					user.save();
					res.send('Correct');
				}
			}
		})
		model.createQuestion();

	},
	// this is NOT WORKING
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
		var newWord = model.createQuestion();
		res.render('quiz', {
			aWord: newWord.text,
			quizLanguage: req.body.quizLanguage
		})
		// });	
	},
	translate: function(req, res) {
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
	},

	quiz: function(req,res) {
		model.createQuiz();
		res.render('quiz');
	}

}

module.exports = controller;