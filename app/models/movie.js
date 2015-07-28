// app/models/movies.js

var mongoose 	= require('mongoose');
var Schema		= mongoose.Schema;

var MovieSchema	= new Schema(
	{
    title : {type: String, default: ' '},
    owner : {type: String, default: ' '}
});

module.exports = mongoose.model('Movie', MovieSchema);