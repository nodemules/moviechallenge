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
    }
  

  });