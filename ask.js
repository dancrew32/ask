var Omegle = require('./omegle');
var omegle = new Omegle();
var question = phantom.args[0];
if (question)
	omegle.askQuestion(question, function(answer) {
		console.log(answer || []);
	});

