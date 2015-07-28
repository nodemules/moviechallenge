// routes ======================================================================

var Movie = require('./models/movie');

function getMovies(res){
    // use mongoose to get all movies in the database
    Movie.find(function(err, movies) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(movies); // return all movies in JSON format
    });
};

module.exports = function(app) {

    // api ---------------------------------------------------------------------
    // get all movies
    app.get('/api/movies', function(req, res) {


    });

    // create movie and send back all movies after creation
    app.post('/api/movies', function(req, res) {

        // create a movie, information comes from AJAX request from Angular
        Movie.create({
            title : req.body.title
        }, function(err, movie) {
            if (err)
                res.send(err);

            res.json({ message: 'Movie created!' });
            // get and return all the movies after you create another
            getMovies(res);
        });

    });

    // delete a movie
    app.delete('/api/movies/:movie_id', function(req, res) {
        Movie.remove({
            _id : req.params.movie_id
        }, function(err, movie) {
            if (err)
                res.send(err);

            // get and return all the movies after you create another
            getMovies(res);
        });
    });

};