$(document).on('ready', function() {

	$(document).on('submit', '#quiz-submit',  function(e) {
		e.preventDefault();

		// console.log('$(#quiz-answer):', $('#quiz-answer').val())
		$.post('/quizResponse', {answer: $('#quiz-answer').val()})
			.done(function(data) {
				console.log(data);
				$('#answer-status').text('Your answer to "' + data.lastWord + '": was ' + data.correct);
				$("#translate-this").text("Translate this word: " + data.translateThis)
				$('#quiz-answer').val('')
			})
	})
})