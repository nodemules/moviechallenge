'use strict';

angular.module('MainApp.Controllers')

.controller('youtubeController', function($scope) {
    $scope.$on('youtube-broadcast', function(event, data) {
        //  $scope.ytid = data;
        alert(data);
    })
})

.controller('challengeController', function($scope, $http, $location, $routeParams, $timeout, $q) {
    var pendingTask;
    var latestTitle;
    var latestChallenge;
    var precomment1, precomment2, postcomment1, postcomment2;
    var movie1, movie2, user1, user2;
    var chal_id;
    $scope.searchResults = [];

    angular.element(document).ready(function() {
        $scope.getChallengeByInstance();

    });

    $scope.alert = function(text) {
        alert(text);
    }

    // @Deprecated
    $scope.change = function() {

        if (pendingTask) {
            clearTimeout(pendingTask);
        }
        console.log("change is occuring");
        pendingTask = setTimeout($scope.fetch(id), 800);
    };

    // @Deprecated
    $scope.selectText = function() {
        setTimeout(function() {
            document.querySelector('#chalinput').select();
        }, 0);
    };

    $scope.eUpdateModel = function(field, term) {
        $scope[field] = term;
    }

    $scope.focused1 = false;
    $scope.focused2 = false;

    $scope.isFocused = function(val) {
        if ($scope['focused' + val] == true) {
            $timeout(function() {
                $scope['focused' + val] = false;
            }, 200)
        } else {
            $scope['focused' + val] = true;
        }
    }

    var challengeContent;
    
    $scope.saveChallenge = function() {
        
        var challenge;
        var chal_id = 0;

        // console.log($scope.challenge != challengeContent ? true : false);
        // console.log("Is challenge content undefined?" + challengeContent == undefined ? true : false);

        //see if challenge exists yet
        if ($scope.challenge != challengeContent || challengeContent == undefined) {
        // challengeContent = $scope.challenge;
        // console.log(challengeContent, $scope.challenge)
        // console.log("Challenge Saving");
        
        $http.get("/api/getchalbyinst/" + $routeParams.param)
            .success(function(response) {

                // if there is something in the response do a put, otherwise post
                if (response.length > 0) {

                    chal_id = response[0]._id;

                    challenge = {
                        challenge: $scope.challenge,
                        date_chal_submitted: Date()
                    }
                    console.log("Challenge Updated");
                    $http.put("/api/challenges/" + chal_id, challenge)
                    $scope.challocked = true;
                } else {
                    if ($scope.challenge){
                        challenge = {
                            challenge: $scope.challenge,
                            date_chal_submitted: Date(),
                            instance: $routeParams.param,
                        }
                    
                        console.log("Challenge Saved");

                        $http.post("/api/postchallenge/", challenge)
                        $scope.challocked = true;
                    }
                    else {
                        console.log("Challenge was empty, not saving.")
                    } 
                }

            });

        } else if ($scope.challenge.length){
            $scope.challocked = true;
        }
    };

    var d;
    var API_URL = 'http://api.themoviedb.org/3/search/movie';
    var API_KEY = '11897eb1c7662904ef04389140fb6638';

    $scope.searchMovies = function(id, term) {
        $scope.searchResults = null;
        // $scope['search' + id] = term;
        if (d) {
            // console.log('cancel earlier search, now searching: ' + term);
            d.resolve();
        }
        d = $q.defer();

        var movies = [];
        var searchResults = [];
        var totalPages = 1;
        var promises = [];
        if (term != undefined && term.length) {
        // first get, for totalPages
        $http.get(API_URL, {
            params: {
                api_key: API_KEY,
                query: term,
                search_type: 'ngram',
                rnd: Math.random(), // prevent cache
                //page: 1,
            },
            timeout: d.promise
        }).then(function(result) {
           // console.log('got 1st page')
            angular.forEach(result.data.results, function(item) {
                movies.push(item);
            })
            totalPages = result.data.total_pages;
            var iMax = Math.min(totalPages, 4); // max pages to get
            for (var i = 2; i <= iMax; i++) {
                promises.push(
                    $http.get(API_URL, {
                        params: {
                            api_key: API_KEY,
                            query: term,
                            search_type: 'ngram',
                            rnd: Math.random(), // prevent cache
                            page: i,
                        },
                        timeout: d.promise
                    })
                );
            }
            return $q.all(promises).then(function(results) {
                angular.forEach(results, function(resultItem) {
                    angular.forEach(resultItem.data.results, function(item) {
                        movies.push(item);
                    })
                })
                movies.sort(function(a, b) {
                    return (a.popularity < b.popularity) ? 1 :
                        ((b.popularity < a.popularity) ? -1 : 0);
                })
                    movies = movies.slice(0, 9);
                    d.resolve(movies);

                    /*  angular.forEach(movies, function(item){
                          $timeout(function(){
                              $http.jsonp('http://api.themoviedb.org/3/movie/' + item.id, {
                              params: {
                                  api_key: '11897eb1c7662904ef04389140fb6638',
                                  append_to_response: "id,credits,videos",
                                  //page: 1,
                                  callback: 'JSON_CALLBACK'
                              }
                          }).success(function(response){
                              console.log(response);
                              searchResults.push(response);
                              console.log(searchResults);
                          })
                      }, 100);
                          
                          searchResults.sort(function(a,b) {
                          return (a.popularity < b.popularity) ? 1 : 
                              ((b.popularity < a.popularity) ? -1 : 0);
                          })
                      })*/

                    angular.forEach(movies, function(object) {
                        object.searchId = id;
                    })
                    //console.log(movies);

                $scope.searchResults = movies;

            });
        });
        return d.promise;
        }
    }

    var typeaheadWait;

    $scope.selectMovie = function(id, tmdb_id, source) {
        var typeaheadSearch = function() { 
            $http.jsonp('http://api.themoviedb.org/3/movie/' + tmdb_id, {
                params: {

                    api_key: '11897eb1c7662904ef04389140fb6638',
                    append_to_response: "id,credits,videos",
                    //page: 1,
                    callback: 'JSON_CALLBACK'
                }
            })
            .success(function(response) {
                // console.log(response)
                $scope['details' + id] = response;
                $scope['search' + id] = response.title;
                $scope['focused' + id] = false;

                $scope.saveMovie(id);
                typeaheadWait = false;
            }).error(function() {
                // This will null out the search if the typeahead select malfunctions
                // $scope['search' + id] = null;
                console.log("There was likely an error with the external API");
                typeaheadWait = false;
            })
        }

        var blurSearch = function(id) {
            console.log("fetch fired");
            console.log($scope['search' + id]);


            var a = function() {
                $http.jsonp('http://api.themoviedb.org/3/search/movie', {
                    params: {
                        api_key: '11897eb1c7662904ef04389140fb6638',
                        query: $scope['search' + id],
                        search_type: 'ngram',
                        append_to_response: "id,credits,videos",
                        rnd: Math.random(), // prevent cache
                        //page: 1,
                        callback: 'JSON_CALLBACK'
                    }

                })
                .success(function(response) {
                    // console.log($scope['search' + id]);
                    // console.log(response);
                    var tmdb_id = null;
                    // $scope.details1 = response.results[0];

                    var b = function() {
                        console.log("Now the search runs by tmdb_id from result.id")
                        $http.jsonp('http://api.themoviedb.org/3/movie/' + tmdb_id, {
                            params: {

                                api_key: '11897eb1c7662904ef04389140fb6638',
                                append_to_response: "id,credits,videos",
                                //page: 1,
                                callback: 'JSON_CALLBACK'
                            }
                        })
                        .success(function(response) {
                            //console.log(response)
                            $scope['search' + id] = response.title;
                            $scope['details' + id] = response;
                            $scope['focused' + id] = false;

                            $scope.saveMovie(id);
                        })
                        .error(function(response) {
                            $scope['search' + id] = null;
                        })
                    }
                    if (response.results.length) {
                        console.log("Search by movie name from blur had a response length");
                        // TODO - Revisit this funcionality to ensure it is fulfilling expectations
                        var stopLoop = false;
                        var i = 0;
                        angular.forEach(response.results, function(result) {
                            i++;
                            var result_title = result.title;
                            if (!stopLoop) {
                                if (result_title.toLowerCase() == search_title.toLowerCase()) {
                                    tmdb_id = result.id;
                                    b();
                                    stopLoop = true;
                                } else if (!stopLoop && i == response.results.length) {
                                    $scope['focused' + id] = false;
                                    $scope['search' + id] = null;
                                    $scope['details' + id] = null;
                                    return false;                          
                                } 
                            }
                        })
                    } else {
                        $scope['focused' + id] = false;
                        $scope['search' + id] = null;
                        $scope['details' + id] = null;
                    }
                })
                .error(function(response) {
                    $scope['search' + id] = null;
                });
            }
            if ($scope['search'+id].length) {
                a();
            }

        };        
        // console.log("selectMovie fired from " + source + " and typeahead " + (typeaheadWait ? "is" : "isn't") + " still searching");
        var search_title = $scope['search' + id];
        var details_title = $scope['details' + id].title;
        if (source == 'typeahead' && tmdb_id && !($scope['details' + id] && tmdb_id == $scope['details' + id].id)) {
            console.log("Typeahead is searching");
            typeaheadWait = true;
            typeaheadSearch();

        } else if (!typeaheadWait && (source == 'blur' && $scope['search' + id]) && !($scope['details' + id] && search_title.toLowerCase() == details_title.toLowerCase())) {
            console.log("Blur is searching");
            blurSearch(id);

        } 
        // This might be @Deprecated
        else {
            typeaheadWait ? null : console.log("no search or save performed");
            $scope['focused' + id] = false;
        }

    }    

    $scope.saveMovie = function(id) {
        var movietitle = {};

        // Requiring $scope['details' + id] in the 'if' statements is probably deprecated
        // We aren't calling $scope.selectMovie() on save anymore (thank god), so we shouldn't
        // need to require details to exist before we save?

        // All the validation should occur before saveMovie() fires, therefore $scope.search1
        // should never exist as an invalid entry, allowing a save to fire. saveMovie() validation
        // may be deprecated, but we leave it in for redundancy.

        var save = function(movietitle) {
            if ($scope['details' + id] && $scope['search' + id] == $scope['details' + id].title && ($scope['search' + id] != window['search' + id] || $scope['details' + id] != window['details' + id] || 'search' + id == undefined)) {
                        console.log("Saving Movie " + id);
                        window['details' + id] = $scope['details' + id];
                        window['search' + id] = $scope['search' + id];

                        $http.get("/api/getchalbyinst/" + $routeParams.param)
                            .success(function(response) {
                                angular.forEach(response, function(result) {
                                    chal_id = response[0]._id;
                                });

                                //why does put only seem to work with findbyid in node? why do I have to do the above step and not just find by instance
                                console.log("Saved Movie " + id);
                                $http.put("/api/challenges/" + chal_id, movietitle)
                            });

            }
        }

        if ($scope['search' + id] && $scope['details' + id]) {
            movietitle['movie' + id] = $scope['search' + id],
            movietitle['details' + id] = $scope['details' + id],
            movietitle['user' + id] = id,
            movietitle['movie' + id + "_postdate"] = Date()
            save(movietitle);
        }
       
    }

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
                    $scope.details1 = response[0].details1;
                    $scope.details2 = response[0].details2;


                    if (response[0].challenge) {
                        $scope.challocked = true;
                    } else {
                        $scope.challocked = false;
                    }
                    if (response[0].movie1) {
                        $scope.movie1locked = true;
                        //$scope.selectMovie(1, $scope.details1.id);
                    } else {
                        $scope.movie1locked = false;
                    }
                    if (response[0].movie2) {
                        $scope.movie2locked = true;
                        //$scope.selectMovie(2, $scope.details2.id);
                    } else {
                        $scope.movie2locked = false;
                    }
                    if (response[0].movie2 && response[0].movie1) {
                        $scope.movieslocked = true;
                    } else {
                        $scope.movieslocked = false;
                    }
                }
            });
    };

    var precomment1_last;
    var precomment2_last;
    var postcomment1_last;
    var postcomment2_last;

    $scope.postcomment = function(com) {

        var comments;
        $http.get("/api/getchalbyinst/" + $routeParams.param)
            .success(function(response) {

                chal_id = response[0]._id;

                switch (com) {
                    case 1:
                        if ($scope.precomment1 != precomment1_last || precomment1_last == undefined){
                        precomment1_last = $scope.precomment1;
                        comments = {
                            precomment1: $scope.precomment1
                        };
                        }
                        break;
                    case 2:
                        if ($scope.precomment2 != precomment2_last || precomment2_last == undefined){
                        precomment2_last = $scope.precomment2;
                        comments = {
                            precomment2: $scope.precomment2
                        };
                        }
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
                    console.log("Save comments");
                $http.put("/api/challenges/" + chal_id, comments)

            });

    };


    // deprecated shite

    $scope.lockchal = function() {
            $scope.challocked = true;
    }
    
    $scope.unlockchal = function() {
        $scope.challocked = false;
    }

    $scope.lockmovie1 = function() {
        if ($scope.search1){
            $scope.movie1locked = true;
        }
    }

    $scope.lockmovie2 = function() {
        if ($scope.search2){
            $scope.movie2locked = true;
        }
    }

}) //end of challengeController

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