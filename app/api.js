var Movie 			= require('./models/movie');
var Challenge		= require('./models/challenge');
var express 		= require('express'),
	app				= express();					// define our app using express


// ROUTES FOR OUR API
// ===========================================================================
var router = express.Router();						// get an instance of the express Router



// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

// on routes that end in /movie    /*****This saves a single movie to the movie collection NOT IN USE******/
router.route('/movies')

	// create a movie (accessed at POST /api/movies)
	.post(function(req, res) {

		var movie = new Movie();		    // create a new instance of the Movie model
		movie.name = req.body.name;	        // set the movies name (comes from the request)
		movie.creator = req.body.creator;   // get lock 1 or 2
		movie.date_submitted = Date();	    // set date

		// save the movie and check for errors
		movie.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Movie created!' });
		});

	})

	// get all the movies (accessed at GET /api/movies)
	.get(function(req, res) {
		Movie.find(function(err, movies) {
			if (err)
				res.send(err);

			res.json(movies);
		});
	});

// on routes that end in /movies/:movie_id  /*****This gets/deletes/updates a single movie to the movie collection NOT IN USE******/
router.route('/movies/:movie_id')

	// get the movie with that id (accessed at GET /api/movies/:movie_id)
	.get(function(req, res) {
		Movie.findById(req.params.movie_id, function(err, movie) {
			if (err)
				res.send(err);
			res.json(movie);
		});
	})

	// update the movie with this id (accessed at PUT /api/movies/:movie_id)
	.put(function(req, res) {

		// use our movie model to find the movie we want
		Movie.findById(req.params.movie_id, function(err, movie) {

			if (err)
				res.send(err);

			movie.name = req.body.name;		// update the movies info

			// save the movie
			movie.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message:  'Movie updated!' });
			});
		});

	})

	.delete(function(req, res) {
		Movie.remove({
			_id: req.params.movie_id
		}, function(err, movie) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully delete' })
		});

	});

// get latest film entered into the Db by ID of creator  /**** DEPRECATED ***/
router.route('/latest/:creator')
    .get(function(req, res) {
         Movie.find({creator: req.params.creator}).sort('-date_submitted').limit(1).exec(function(err, movies) { 
        	if (err)
				res.send(err);

			res.json(movies);
    });
});

// on routes that end in /challenges
router.route('/postchallenge/')

	// create a challenge (accessed at POST /api/movies)
	.post(function(req, res) {

		var challenge = new Challenge();		    // create a new instance of the Challenge model
		challenge.challenge = req.body.challenge;	       		
		challenge.chal_date_submitted = Date();	    	// set date
		challenge.instance = req.body.instance;   
		// save the challenge and check for errors
		challenge.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Challenge created!' });
		});

	})


router.route('/getchalbyinst/:inst')
    .get(function(req, res) {
    	console.log(req.params.inst);
         	Challenge.find({instance: req.params.inst}).exec(function(err, challenge) {
        	if (err)
				res.send(err);

			res.json(challenge);
    });
}); 

router.route('/challenges/:chal_id')
	.put(function(req, res) {
    

	    Challenge.findById(req.params.chal_id, function(err, challenge) {
        // Challenge.find({instance: req.params.inst}, function(err, challenge) {

			if (err)
				res.send(err);


			if (req.body.challenge) { challenge.challenge = req.body.challenge;}
			if (req.body.movie1) { challenge.movie1 = req.body.movie1;}
			if (req.body.user1) { challenge.user1 = req.body.user1;}
			if (req.body.movie1_date_submitted) { challenge.movie1_date_submitted = req.body.movie1_date_submitted; }
			if (req.body.movie2) { challenge.movie2 = req.body.movie2; }
			if (req.body.date_chal_submitted) { challenge.date_chal_submitted = req.body.date_chal_submitted; }
			if (req.body.precomment1) { challenge.precomment1 = req.body.precomment1; }
			if (req.body.postcomment1) { challenge.postcomment1 = req.body.postcomment1; }		
			if (req.body.precomment2) { challenge.precomment2 = req.body.precomment2;	}	
			if (req.body.postcomment2) { challenge.postcomment2 = req.body.postcomment2; }
			if (req.body.user2) { challenge.user2 = req.body.user2; }
			if (req.body.movie2_date_submitted) { challenge.movie2_date_submitted = req.body.movie2_date_submitted; }
			if (req.body.details1) { challenge.details1 = req.body.details1; }
			if (req.body.details2) { challenge.details2 = req.body.details2; }
				

			// save comments
			challenge.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message:  'updated!' });
			});
		});

	})


// get latest 10 challenges entered into the db for front page list
router.route('/latest/')
    .get(function(req, res) {
         Challenge.find({}).sort('-chal_date_submitted').limit(10).exec(function(err, response) { 
        	if (err)
				res.send(err);

			res.json(response);
    });
});





module.exports = router;      // somehow connects back to server.js (??)
