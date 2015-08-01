// app/models/Challenge.js

var mongoose			= require('mongoose');
var	Schema 				= mongoose.Schema;

var	ChallengeSchema			= new Schema({
		challenge: String,
		date_submitted: Date
	});

module.exports = mongoose.model('Challenge', ChallengeSchema);