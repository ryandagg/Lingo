$(document).on('ready', function() {

	$('#quiz-submit').on('click', function(e) {
		e.preventDefault();
		// this is NOT WORKING
		console.log('$(#quiz-answer:', $('#quiz-answer').val())
		$.post('/quizResponse', {answer: $('#quiz-answer').val()})
			.done(function(data) {
				$('#answer-status').text('Your answer is: ' + data)
			})
	})
})