    var express = require('express');
    var app = express();
    var bodyParser = require('body-parser');
    var stylus = require('stylus')
    var nib = require('nib')
    var port     = process.env.PORT || 8080;                // set the port
    var morgan = require('morgan');                         // log requests to the console (express4)
  //Figure out which are needed:
    // var path = require('path');
    // var favicon = require('serve-favicon');
    // var logger = require('morgan');
    // var cookieParser = require('cookie-parser');

// Database

    //var mongo = require('mongodb');                       // still needed?
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var database = require('./config/database');            // load the database config

    mongoose.connect(database.url);     // connect to mongoDB database on modulus.io
    
// configure app to use bodyParser()
// this will let us get the data from a POST
    app.use(bodyParser.urlencoded({ extended: true}));                   // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                          // parse application/json
    // app.use(bodyParser.json({ type: 'application/vnd.api+json' }));   // parse application/vnd.api+json as json

// routes ======================================================================
   // all of our api routes will be prefixed with /api
     var routes = require('./app/routes');
     app.use('/api', routes);
  

// compile stylus & nibg
    function compile(str, path) {
      return stylus(str)
      .set('filename', path)
      .use(nib())
    }

// view engine setup
    app.set('views', __dirname + '/views')
    app.set('view engine', 'jade')
    app.use(stylus.middleware(
      { src: __dirname + '/public'
        , compile:compile
      }
    ))
    app.use(express.static(__dirname + '/public'))
    app.use(morgan('dev'));                                         // log every request


<<<<<<< Updated upstream
// render the webpage through node with instances
    app.get('/:inst', function (req, res) {
      res.render('index',
=======

// render the webpage through node

// render the webpage through node with instances
    app.get('/:inst', function (req, res) {
      res.render('challenge',
>>>>>>> Stashed changes
      { title : 'Home' }
      )
    })
//default (broken- just need something here)
    app.get('/', function (req, res) {
      res.render('index',
      { title : 'Home' }
      )
    })

//if needed re-enabled
//app.use(favicon(__dirname + '/public/favicon.ico'));   // uncomment after placing your favicon in /public
//app.use(logger('dev'));
//app.use(cookieParser());


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);

module.exports = app;                 // connects server.js to other node js files (??)