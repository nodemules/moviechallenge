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
		date_chal_submitted: Date,
		date_chal_updated: Date,
		movie1: String,
		movie2: String,
		details1: Object,
		details2: Object,
		movie1_date_submitted: Date,
		movie2_date_submitted: Date,
		user1: String,
		user2: String,
		precomment1: String,
		postcomment1: String,
		precomment2: String,
		postcomment2: String,
		locked: Boolean,
		challocked: Boolean,
		movieslocked: Boolean

	});

module.exports = mongoose.model('Challenge', ChallengeSchema);