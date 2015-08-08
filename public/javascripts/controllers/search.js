'use strict';

angular.module('SearchApp', [])
    .controller('SearchController', function($scope, $http) {
        var pendingTask;
        var latestTitle;
        var latestChallenge;
        var precomment1, precomment2, postcomment1, postcomment2;
        var chal_id;


        getlatest(1);
        getlatest(2);

        getlatestChallenge();

        fetch();

        $scope.change = function() {
            if (pendingTask) {
                clearTimeout(pendingTask);
            }
            pendingTask = setTimeout(fetch, 800);
        };

        function getlatestChallenge() {
            $http.get("/api/latest")
                .success(function(response) {

                    angular.forEach(response, function(result) {
                        latestChallenge = response[0].challenge;
                        precomment1 = response[0].precomment1;
                        postcomment1 = response[0].postcomment1;
                        precomment2 = response[0].precomment2;
                        postcomment2 = response[0].postcomment2;

                    });
                    $scope.challenge = latestChallenge;
                    $scope.precomment1 = precomment1;
                    $scope.postcomment1 = postcomment1;
                    $scope.precomment2 = precomment2;
                    $scope.postcomment2 = postcomment2;


                });
        };

        $scope.postcomment = function(){
            //first get latest challenge
            $http.get("/api/latest")
                .success(function(response) {

            angular.forEach(response, function(result) {
                chal_id = response[0]._id;
            });
            
                        var comments = {
                        precomment1  : $scope.precomment1,
                        postcomment1  : $scope.postcomment1,
                        precomment2  : $scope.precomment2,
                        postcomment2  : $scope.postcomment2
            }

            //feed ID into put
            $http.put("/api/challenges/" + chal_id, comments)
            
            });

           

        };


        $scope.saveChallenge = function() {
            var challenge = {
                challenge : $scope.challenge,
                date_submitted: Date()
            }
            $http.post("/api/challenges/", challenge)

        };
        function getlatest(user) {
            $http.get("/api/latest/" + user)
                .success(function(response) {

                    angular.forEach(response, function(result) {
                        latestTitle = response[0].name;

                    });
                    
                    if (user == 1) {
                        $scope.search1 = latestTitle;
                    };
                    if (user == 2) {
                        $scope.search2 = latestTitle;
                    };
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

        };

    });