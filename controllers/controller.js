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
		// console.log("submited word: ", req.body.quizAnswer);
		model.User.findOne({id: 0}, function(error, user) {
			if(error) {
				console.log('Not found in quiz response')
			}else {
				console.log("User info:", user)
				// If question is answered correctly
				if(user.questions[user.currentQuestion].answer === req.body.answer) {
					User.findOneAndUpdate({id: 0}, {$set: {isCorrect: true}}, function(error, data) {
						if(error) {
							console.log('Update isCorrect failed')
						}
					});
					res.send('Correct');
				}
				else {
					res.send('Wrong')
					if (!user.questions[user.currentQuestion-1].isCorrect && !user.questions[user.currentQuestion-2].isCorrect) {
						
					}

				}
			}
		})
	},
	setLanguage: function(req, res) {
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
	}

}

module.exports = controller;