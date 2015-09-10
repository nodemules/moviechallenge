'use strict';

angular.module('MainApp.Controllers')

.controller('challengeController', function($scope, $http, $location, $routeParams) {
    var pendingTask;
    var latestTitle;
    var latestChallenge;
    var precomment1, precomment2, postcomment1, postcomment2;
    var movie1, movie2, user1, user2;
    var chal_id;

    // getChallengeByInstance(); // should only run on instanced pages
    // fetch();

    angular.element(document).ready(function() {
        $scope.getChallengeByInstance();
    });

    $scope.change = function() {

        if (pendingTask) {
            clearTimeout(pendingTask);
        }
        console.log("change is occuring");
        pendingTask = setTimeout($scope.fetch(), 800);
    };

    $scope.fetch = function() {
        if ($scope.search1) {

            $http.jsonp('http://api.themoviedb.org/3/search/movie', {
            params: {
                api_key: '11897eb1c7662904ef04389140fb6638',
                query: $scope.search1,
                search_type: 'ngram',
                rnd: Math.random(),   // prevent cache
                //page: 1,
                callback: 'JSON_CALLBACK'
            }

            })
            .success(function(response) {
                console.log(response);
                // $scope.details1 = response.results[0];
                var tmdb_id = response.results[0].id;

                $http.jsonp('http://api.themoviedb.org/3/movie/' + tmdb_id, {
                    params: {

                api_key: '11897eb1c7662904ef04389140fb6638',
                append_to_response: "id,credits,videos",
                //page: 1,
                callback: 'JSON_CALLBACK'
                    }
                })
                .success(function(response) {
                    console.log(response)
                    $scope.details1 = response;
                })                
            });
        };

        if ($scope.search2) {
            $http.jsonp('http://api.themoviedb.org/3/search/movie', {
            params: {
                api_key: '11897eb1c7662904ef04389140fb6638',
                query: $scope.search2,
                search_type: 'ngram',
                rnd: Math.random(),   // prevent cache
                //page: 1,
                callback: 'JSON_CALLBACK'
            }

            })
            .success(function(response) {
                console.log(response);
                // $scope.details1 = response.results[0];
                var tmdb_id = response.results[0].id;

                $http.jsonp('http://api.themoviedb.org/3/movie/' + tmdb_id, {
                    params: {

                api_key: '11897eb1c7662904ef04389140fb6638',
                append_to_response: "id,credits,videos",
                //page: 1,
                callback: 'JSON_CALLBACK'
                    }
                })
                .success(function(response) {
                    console.log(response)
                    $scope.details2 = response;
                })                
            });
        };
    };


    $scope.getChallengeByInstance = function() {
        $http.get("/api/getchalbyinst/" + $routeParams.param)
            .success(function(response) {

                // Bring this back later when we work out how to integrate it with the inputs
                // or have the input fields change to div so we can use expressions
                // $scope.challenge = response;

                //first check that this is an existing challenge otherwise the console errors
                if (response.length > 0) {
                    $scope.challenge = response[0].challenge;
                    $scope.precomment1 = response[0].precomment1;
                    $scope.postcomment1 = response[0].postcomment1;
                    $scope.precomment2 = response[0].precomment2;
                    $scope.postcomment2 = response[0].postcomment2;
                    $scope.search1 = response[0].movie1;
                    $scope.search2 = response[0].movie2;

                    if (response[0].challenge) {
                        $scope.challocked = true;
                    } else {
                        $scope.challocked = false;
                    }
                    if (response[0].movie1) {
                        $scope.movie1locked = true;
                    } else {
                        $scope.movie1locked = false;
                    }
                    if (response[0].movie2) {
                        $scope.movie2locked = true;
                    } else {
                        $scope.movie2locked = false;
                    }
                    if (response[0].movie2 && response[0].movie1) {
                        $scope.movieslocked = true;
                    } else {
                        $scope.movieslocked = false;
                    }
                }
                    $scope.fetch();
            });
    };

    $scope.postcomment = function(com) {
        //first get instance challenge
        var comments;
        $http.get("/api/getchalbyinst/" + $routeParams.param)
            .success(function(response) {

                chal_id = response[0]._id;

                switch (com) {
                    case 1:
                        comments = {
                            precomment1: $scope.precomment1
                        };
                        break;
                    case 2:
                        comments = {
                            precomment2: $scope.precomment2
                        };
                        break;
                    case 3:
                        comments = {
                            postcomment1: $scope.postcomment1
                        };
                        break;
                    case 4:
                        comments = {
                            postcomment2: $scope.postcomment2
                        };
                        break;

                    default:
                        comments = null;
                }


                //feed ID into put
                $http.put("/api/challenges/" + chal_id, comments)

            });

    };

    /**************************/
    //Handle flow and lock and /
    //unlock animations.       /
    //Refactor the shit out of /
    //this.                    /
    /**************************/
    $scope.selectText = function() {
        setTimeout(function() {
          document.querySelector('#chalinput').select();
        }, 0);
    };


    // lockinit();

    function lockinit() {
        $http.get("/api/getchalbyinst/" + $routeParams.param)
            .success(function(response) {

                if (response.length > 0) {

                    if (response[0].challenge) {
                        $scope.challocked = true;
                    } else {
                        $scope.challocked = false;
                    }
                    if (response[0].movie1) {
                        $scope.movie1locked = true;
                    } else {
                        $scope.movie1locked = false;
                    }
                    if (response[0].movie2) {
                        $scope.movie2locked = true;
                    } else {
                        $scope.movie2locked = false;
                    }
                    if (response[0].movie2 && response[0].movie1) {
                        $scope.movieslocked = true;
                    } else {
                        $scope.movieslocked = false;
                    }

                } else {
                    $scope.challocked = false;
                }
            });
    }

    $scope.consoleLogBrah = function() {
        console.log("HERES YOUR CONSOLE BRAH");
    };


    // deprecated shite

    $scope.movieslocked = function() {
        console.log("REALLY DOUBLE QUOTES BRAH?");
        
        $http.get("/api/getchalbyinst/" + $routeParams.param)
            .success(function(response) {
                        console.log('text!' + response);
                if (response.length > 0) {
                    if (response[0].movie2 && response[0].movie1) {
                        console.log('text' + response);
                        $scope.movieslocked = true;
                    } else {
                        $scope.movieslocked = false;
                    }
                }
            });
    }

    $scope.lockchal = function() {
        $scope.challocked = true;

    }
    $scope.unlockchal = function() {
        $scope.challocked = false;
    }

    $scope.lockmovie1 = function() {
        $scope.movie1locked = true;
    }

    $scope.lockmovie2 = function() {
        $scope.movie2locked = true;
    }


    $scope.saveChallenge = function() {
        var challenge;
        var chal_id = 0;

        //see if challenge exists yet
        $http.get("/api/getchalbyinst/" + $routeParams.param)
            .success(function(response) {

                // if there is something in the response do a put, otherwise post
                if (response.length > 0) {

                    chal_id = response[0]._id;

                    challenge = {
                        challenge: $scope.challenge,
                        date_chal_submitted: Date()
                    }

                    $http.put("/api/challenges/" + chal_id, challenge)
                } else {

                    challenge = {
                        challenge: $scope.challenge,
                        date_chal_submitted: Date(),
                        instance: $routeParams.param,
                    }

                    $http.post("/api/postchallenge/", challenge)

                }

            });

    };


    $scope.saveMovie = function(field) {
        var movietitle;
        if (field == 1) {
            movietitle = {
                movie1: $scope.search1,
                user1: "1",
                movie1_postdate: Date()

            }
        }
        if (field == 2) {
            movietitle = {
                movie2: $scope.search2,
                user2: "2",
                movie2_postdate: Date()

            }
        }

        $http.get("/api/getchalbyinst/" + $routeParams.param)
            .success(function(response) {

                angular.forEach(response, function(result) {
                    chal_id = response[0]._id;
                });

                //why does put only seem to work with findbyid in node? why do I have to do the above step and not just find by instance
                $http.put("/api/challenges/" + chal_id, movietitle)
            });
    };


})

/*.controller('modalController', function($scope, $modal) {
    $scope.openYoutubeModal = function(size) {

        var modalInstance = $modal.open ({
            templateUrl: '../../partials/youtube-modal',
            controller: 'modalInstanceController',
            size: size
        })
    }
})

.controller('modalInstanceController', function ($scope, $modalInstance) {
    $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})*/

.controller('miscController', function($scope, $http, $location) {
    $scope.generateInstanceID = function() {
        var inst_id = ("00000" + (Math.random() * Math.pow(36, 5) << 0).toString(36)).slice(-5); // how do we add capital letters?
        $location.path("/instances/" + inst_id);
    };
})

.controller('listController', function($scope, $http, $location, $routeParams) {

    last10Challenges();

    // display the last  challenges for the view
    function last10Challenges() {
        $http.get("/api/latest/")
            .success(function(response) {
                $scope.latest = response;
            });
    };


})




.controller('RouteController', function($scope, $routeParams) {
    $scope.param = $routeParams.param;
    console.log($scope.param)
});