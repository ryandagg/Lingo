$(document).on('ready', function() {

	$(document).on('submit', '#quiz-submit',  function(e) {
		e.preventDefault();

		console.log('$(#quiz-answer:', $('#quiz-answer').val())
		$.post('/quizResponse', {answer: $('#quiz-answer').val()})
			.done(function(data) {
				$('#answer-status').text('Your answer is: ' + data)
			})
	})
})