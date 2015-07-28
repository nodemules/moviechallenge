'use strict';

angular.module('myApp', [])
  .controller('MovieController', function($scope, $http) {
    var pendingTask;
/*
    $scope.search1 = "Alien";
    $scope.search2 = "Jaws";*/
    function getlatestfilm() {

   $http.get('/movies/getlastid')
        .success(function(response) {
            

            angular.forEach(response, function(film) {
            $scope.search1 = film.movietitle;
            });
             fetch();
        })
        .error(function(response) {
             alert("TOTAL FAIL");
            
        });
   };


  getlatestfilm();
  

/*  if ($scope.search1 === undefined) {
      $scope.search1 = "Alien";
    }
    if ($scope.search2 === undefined) {
      $scope.search2 = "Jaws";
    }*/
     

     

  
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
    }




/*    $scope.update = function(movie) {
      $scope.search = movie.Title;
      $scope.change();
    };*/

/*    $scope.select = function() {
      this.setSelectionRange(0, this.value.length);
    }*/
  });