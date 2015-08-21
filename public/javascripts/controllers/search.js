'use strict';

angular.module('SearchApp', [])

/* Configure usage so we can provide instances via the URL with no hash sign */
.config(function($locationProvider) {
       $locationProvider.html5Mode({
  enabled: true,
  requireBase: false
});
})

.controller('SearchController', function($scope, $http, $location, $window) {
        var pendingTask;
        var latestTitle;
        var latestChallenge;
        var precomment1, precomment2, postcomment1, postcomment2;
        var movie1, movie2, user1, user2;
        var chal_id;

        /*GET INSTANCE */
        var inst = $location.path().substring(1); //substring chops off the slash
      

        //getlatest(1);
        //getlatest(2);

        getChallengeByInstance();
        last10Challenges();

        fetch();

        $scope.generateInstanceID = function() {
            var inst = ("00000" + (Math.random()*Math.pow(36,5) << 0).toString(36)).slice(-5);
            $location.url("/" + inst)
            $window.location.reload();
        };

        // display the last  challenges for the view
        function last10Challenges() {
            $http.get("/api/latest/")
                .success(function(response) {
                    $scope.latest = response;
                });
        };


        $scope.change = function() {
            if (pendingTask) {
                clearTimeout(pendingTask);
            }
            pendingTask = setTimeout(fetch, 800);
        };

        function getChallengeByInstance() {
            $http.get("/api/getchalbyinst/" + inst)
                .success(function(response) {

                    // Bring this back later when we work out how to integrate it with the inputs
                    // or have the input fields change to div so we can use expressions
                    // $scope.challenge = response;


                    $scope.challenge = response[0].challenge;
                    $scope.precomment1 = response[0].precomment1;
                    $scope.postcomment1 = response[0].postcomment1;
                    $scope.precomment2 = response[0].precomment2;
                    $scope.postcomment2 = response[0].postcomment2;
                    $scope.search1 = response[0].movie1;
                    $scope.search2 = response[0].movie2;                  

                    fetch();


                });
        };

        $scope.postcomment = function(){
            //first get instance challenge

            //make this more robust: currently all buttons will update all fields.

            $http.get("/api/getchalbyinst/" + inst)
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
                date_submitted: Date(),
                instance: inst,
               /* movie1: "",
                movie2: "",
                precomment1: "",
                precomment2: "",
                postcomment1: "",
                postcomment2: "",
                user1: "",
                user2: "",
                movie1_date_submitted: "",
                movie2_date_submitted: "",*/

            }
            $http.post("/api/postchallenge/", challenge)

        };
        function getlatest() {
           $http.get("/api/getchalbyinst/" + inst)
           // $http.get("/api/latest/" + user)
                .success(function(response) {

                    angular.forEach(response, function(result) {
                        latestTitle1 = response[0].movie1;
                        latestTitle2 = response[0].movie2;
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
                    movie1: $scope.search1,
                    user1: "1",
                    movie1_date_submitted: Date()

                }
            }
            if (field == 2) {
                movietitle = {
                    movie2: $scope.search2,
                    user2: "2",
                    movie2_date_submitted: Date()

                }
            }

            $http.get("/api/getchalbyinst/" + inst)
            .success(function(response) {

            angular.forEach(response, function(result) {
                chal_id = response[0]._id;
            });
        
            //why does put only seem to work with findbyid in node? why do I have to do the above step and not just find by instance
            $http.put("/api/challenges/" + chal_id, movietitle)
            });
        };

    });