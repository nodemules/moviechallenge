// app/models/movie.js

var mongoose			= require('mongoose');
var	Schema 				= mongoose.Schema;

var	MovieSchema			= new Schema({
		name: String,
		creator: String,
		date_submitted: Date
	});

module.exports = mongoose.model('Movie', MovieSchema);