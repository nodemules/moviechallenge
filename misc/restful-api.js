var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('bodyParser'),

	// Mongoose Schema definition
	Schema = new mongoose.Schema({
		id 			: String,
		title 		: String,
		completed	: Boolean
	}),

	Movie = mongoose.model('Movie', Schema)

// REST api

express()
	.use(bodyParser.json()) // support json encoded bodies
	.use(bodyParser.urlencoded({ extended: true})) // support encoded bodies

	// get
	.get('/api', function (req, res) {
		res.json(200, { msg: 'OK' });
	})

	.get('/api/movies', function (req, res) {
		Movie.find( function ( err, movies){
			res.json(200, movies);
		});
	})

	// post
	.post('/api/movies', function (req, res) {
		var movies = new Movie( req.body );
		movie.id = movie._id;
		movie.save(function (err) {
			res.json(200, todo);
		});
	})

	// delete

	.del('/api/movies', function (req, res) {
		Movie.remove({completed: true}, function ( err ) {
			res.json(200, {msg: 'OK'});
		});
	})

	// find

	.get('/api/movies/:id', function (req, res) {
		Movie.findById( req.params.id, function ( err, movie ) {
			res.json(200, movie);
		});
	})

	.put('/api/movies/:id', function (req, res) {
		Movie.findById( req.params.id, function ( err, movie) {
			movie.Title = req.body.title;
			movie.completed = req.body.completed; // "checkbox" functionality, could be used to "lock" selection?
			movie.save( function ( err, todo) {
				res.json(200, todo);
			});
		});
	})

	.del('api/movies/:id', function (req, res) {
		Movie.findById( req.params.id, function (err, movie) {
			movie.remove( function ( err, todo ) {
				res.json(200, {msg: 'OK'});
			});
		});
	})