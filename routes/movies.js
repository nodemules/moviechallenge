var express = require('express');
var router = express.Router();

/*** GET ALL MOVIES ***/

router.get('/allmovies', function(req, res) {
    var db = req.db;
    var collection = db.get('moviearchive');
    collection.find({},{},function(e,docs){
        res.json(docs);
        console.log(docs);
    });
});

/*** GET LATEST MOVIE ***/
//TODO: tell it who's who. Need the latest film for that user

router.get('/getlastid', function(req, res) {
    var db = req.db;
    var collection = db.get('moviearchive');
    collection.find({},{limit: 1, sort: {_id: -1}},function(e,docs){
        res.json(docs);
        console.log(docs);
    });
});

/*** FOR USE IN COMMITTING SELECTION ***/

router.post('/commitmovie', function(req, res) {
    var db = req.db;
    var collection = db.get('moviearchive');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

module.exports = router;
