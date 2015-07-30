'use strict';

angular.module('SearchApp', [])
  .controller('SearchController', function($scope, $http) {
      var pendingTask;
      fetch();   



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
    };
      

    $scope.saveMovie1 = function() {
      var movietitle = {
              name : $scope.search1
          }

      $http.post("/api/movies", movietitle)
        .success(function(response) {
          return response;
/*          if (err)
            res.send(err);

          res.json({ message: 'Movie saved!' });*/
        });
    };      

  });