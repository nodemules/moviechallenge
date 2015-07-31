'use strict';

angular.module('SearchApp', [])
    .controller('SearchController', function($scope, $http) {
        var pendingTask;
        var latestTitle;


        getlatest(1);
        getlatest(2);

        $scope.change = function() {
            if (pendingTask) {
                clearTimeout(pendingTask);
            }
            pendingTask = setTimeout(fetch, 800);
        };

        function getlatest(user) {
            $http.get("/api/latest/" + user)
                .success(function(response) {

                    angular.forEach(response, function(result) {
                        latestTitle = response[0].name;

                    });

                    $http.get("http://www.omdbapi.com/?t=" + latestTitle + "&tomatoes=true&plot=full")
                        .success(function(response) {
                            if (user == 1) {
                                $scope.details1 = response;
                            };
                            if (user == 2) {
                                $scope.details2 = response;
                            }
                        });
                });

        }

        function fetch() {
            if ($scope.search1) {
            $http.get("http://www.omdbapi.com/?t=" + $scope.search1 + "&tomatoes=true&plot=full")
                .success(function(response) {
                    $scope.details1 = response;
                });
            };
            if ($scope.search2) {
            $http.get("http://www.omdbapi.com/?t=" + $scope.search2 + "&tomatoes=true&plot=full")
                .success(function(response) {
                    $scope.details2 = response;
                });
            };
        };


        $scope.saveMovie = function(field) {
            var movietitle;
            if (field == 1) {
                movietitle = {
                    name: $scope.search1,
                    creator: "1",
                    date_submitted: Date()

                }
            }
            if (field == 2) {
                movietitle = {
                    name: $scope.search2,
                    creator: "2",
                    date_submitted: Date()

                }
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