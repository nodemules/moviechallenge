var express 		= require('express'),
	app				= express();					// define our app using express

// ROUTES FOR OUR INSTANCES
// ===========================================================================
var instancer = express.Router();						// get an instance of the express Router

instancer.route('/:inst')
	.get(function(req, res) {
      res.render('challenge',
      { title : 'Challenge' }
      )
	})

module.exports = instancer;