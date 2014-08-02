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
				var quizNumber = user.quizzes.length;
				var isCorrect;
				// stored current word to send to client/jQueary
				var previousWord = user.questions[user.currentQuestion].text;
				var failedMessage = null;
				var boolListInUser = user.quizzes[user.currentQuiz].boolList;
				var shouldCreateQuiz = false;
				// if wrong answer given to question
				// if(user.questions[user.currentQuestion].answer !== req.body.answer) 
				if(!model.fuzzyAnswerCheck(user.questions[user.currentQuestion].answer, req.body.answer)) {
					isCorrect = "Wrong";
					// push a 'false' to quizzes boolList
					user.quizzes[user.currentQuiz].boolList.push(false);
					// user.markModified('quizzes');

					// helper var to make following if conditional easier to read. It access the current quiz in the user
					

					// check if the last 2 questions were also wrong
					if (boolListInUser.length > 2 
						&& !boolListInUser[boolListInUser.length - 1] 
						&& !boolListInUser[boolListInUser.length - 2] 
						&& !boolListInUser[boolListInUser.length - 3]) {
						// // this is async as pushing empty objects to quizzes
						// user.quizzes.push(new model.createQuiz());
						shouldCreateQuiz = true;
						failedMessage = "You answered three quiz questions in a row wrong and have failed the quiz! Starting a new quiz.";
												
					}
					else if(boolListInUser.length === 10){
						// // this is async as pushing empty objects to quizzes
						shouldCreateQuiz = true;
						console.log("user.quizzes[user.currentQuiz].passed:", user.quizzes[user.currentQuiz].passed)
						user.quizzes[user.currentQuiz].passed = true;
						// user.quizzes.push(new model.createQuiz());
						failedMessage = "You passed the quiz!"
					}
					quizNumber = user.quizzes.length;
				}
				// if the answer is correct
				else{
					// check to make a new quiz
					if(boolListInUser.length === 10){
						shouldCreateQuiz = true;
						user.quizzes[user.currentQuiz].passed = true;
						console.log("user.quizzes[user.currentQuiz]:", user.quizzes[user.currentQuiz])
						// user.quizzes.push(new model.createQuiz());
						quizNumber = user.quizzes.length;
						failedMessage = "You passed the quiz! Starting a new quiz."
					}

					user.questions[user.currentQuestion].isCorrect = true;
					user.quizzes[user.currentQuiz].boolList.push(true);
					isCorrect = "Correct"

				}
				console.log("user.quizzes[user.currentQuiz].passed - before pushing new quiz:", user.quizzes[user.currentQuiz].passed)

				if(shouldCreateQuiz && user.quizzes[user.currentQuiz].passed){
					user.currentQuiz++;
					user.quizzes.push({passed: false, boolList: []});
					user.quizzes[user.currentQuiz - 1].passed = true;
					// model.createQuiz(function(err, quiz){
					// 	user.quizzes.push(quiz.newQuiz); 
					// 	user.save();
				}
				else if(shouldCreateQuiz){
					user.currentQuiz++;
					user.quizzes.push({passed: false, boolList: []});
				}
				
				// console.log("user.quizzes[user.currentQuiz - 1].passed:", user.quizzes[user.currentQuiz -1].passed) // false here
				// update database with changes to user
				user.markModified('quizzes');
				user.markModified('quizzes.passed');
				user.markModified('questions');
				console.log("user:", user);

				user.save();
				

			}

			model.createQuestion(user.questions[user.currentQuestion].from, function(err, newWord){
				// ajax change quiz page
				// console.log("newWord - controller quizResponse:", newWord)
				res.send({
					correct: isCorrect,
					translateThis: newWord.text,
					lastWord: previousWord,
					quizNumber: quizNumber,
					failedMessage: failedMessage
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
				model.User.findOne({id: 0}, function(error, user) {
					res.render('quiz', {
						aWord: newWord.text,
						quizLanguage: req.body.quizLanguage,
						quizNumber: user.quizzes.length
					})
				})
			}
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
		model.createQuiz(function(error, quiz) {
			res.render('quiz', {quizNumber: quiz.length})
		});
	}
}

module.exports = controller;