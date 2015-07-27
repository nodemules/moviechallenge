'use strict';

angular.module('myApp', [])
  .controller('MovieController', function($scope, $http) {
    var pendingTask;
/*
    $scope.search1 = "Alien";
    $scope.search2 = "Jaws";*/

  if ($scope.search1 === undefined) {
      $scope.search1 = "Alien";
    }
    if ($scope.search2 === undefined) {
      $scope.search2 = "Jaws";
    }
      fetch();

    //TODO: Get current locked in movie for Jay
    // Get current locked in movie for Brent
    //If no current movie display nothing
    //How to get current locked in movie
    //fetch
    //db.moviearchive.find(most recent id with locked flag = 1){ get title
    //  scope.search1 = title

/*router.get('/getlastid', function(req, res) {
    var db = req.db;
   
    var collection = db.get('postings');
    console.log("getlastid");
    collection.find({},{limit: 1, sort: {_id: -1}},function(e,docs){
        res.json(docs);
    });
});*/


      //}
      //fetch();
      var collection = db.get('moviearchive');
      collection.find({ movieid: 1 } , function(e,docs){
        res.json(docs);
           alert(res.jason(docs));
    });


    

    $scope.change = function() {
      if (pendingTask) {
        clearTimeout(pendingTask);
      }
      pendingTask = setTimeout(fetch, 800);
    };

    function fetch() {
      $http.get("http://www.omdbapi.com/?t=" + $scope.search1 + "&tomatoes=true&plot=full")
        .success(function(response) {
          $scope.details1 = response;
        });

      $http.get("http://www.omdbapi.com/?t=" + $scope.search2 + "&tomatoes=true&plot=full")
        .success(function(response) {
          $scope.details2 = response;
        });
    }

     //Lock in button:
     //Store movie selection in mongo
     //db.moviearchive.insert(next available id, $scope.search1, user)


/*    $scope.update = function(movie) {
      $scope.search = movie.Title;
      $scope.change();
    };*/

/*    $scope.select = function() {
      this.setSelectionRange(0, this.value.length);
    }*/
  });