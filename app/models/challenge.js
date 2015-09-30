// app/models/Challenge.js

var mongoose			= require('mongoose');
var	Schema 				= mongoose.Schema;

var	ChallengeSchema			= new Schema({
		instance: { 
			type: String, 
			index: true,
			unique: true, 
			dropDups: true
		},
		challenge: String,
		chal_date_submitted: Date,
		search1: String,
		search2: String,
		movie1_postdate: Date,
		movie2_postdate: Date,
		user1: String,
		user2: String,
		precomment1: String,
		postcomment1: String,
		precomment2: String,
		postcomment2: String

	});

module.exports = mongoose.model('Challenge', ChallengeSchema);