<<<<<<< HEAD
// app/models/movie.js

var mongoose			= require('mongoose');
var	Schema 				= mongoose.Schema;

var	MovieSchema			= new Schema({
		name: String	
	});
=======
// app/models/movies.js

var mongoose 	= require('mongoose');
var Schema		= mongoose.Schema;

var MovieSchema	= new Schema(
	{
    title : {type: String, default: ' '},
    owner : {type: String, default: ' '}
});
>>>>>>> ecabc223286e9a421559c9c0de610d9663fe1a91

module.exports = mongoose.model('Movie', MovieSchema);