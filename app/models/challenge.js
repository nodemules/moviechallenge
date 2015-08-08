// app/models/Challenge.js

var mongoose			= require('mongoose');
var	Schema 				= mongoose.Schema;

var	ChallengeSchema			= new Schema({
		challenge: String,
		date_submitted: Date,
		precomment1: String,
		postcomment1: String,
		precomment2: String,
		postcomment2: String
	});

module.exports = mongoose.model('Challenge', ChallengeSchema);