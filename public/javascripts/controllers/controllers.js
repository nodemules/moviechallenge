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
    $scope.searchError = false;

    // TODO -- RENAME THIS FUNCTION

    $scope.textFill = function(e) {
        var id;
        if (isNaN(e)) {
            id = $(e.target).attr('id');
        } else {
             id = $scope.locked ? 'searchlocked' + e : ($scope['focused' + e] ? 'e-search' + e : 'search' + e);
        }

        $timeout(function() {
            var length;
    
            var fontsize = $('#' + id).css('font-size');
            var w = $('#' + id).css('width');
    
            w = parseInt(w);
            fontsize = parseInt(fontsize);

            id = id.replace(/\D/g,'');
        
            if ($scope['search' + id]) {
                length = $scope['search' + id].length;
            }
    
            var maxChars = w / (fontsize/Math.E);
    
            // console.log(length, parseInt(w), parseInt(fontsize), maxChars);

            /*
            *  TODO - The function should increase font-size as length
            *         becomes shorter, up to 36px;
            */

            if (length > maxChars) {
                fontsize = fontsize * maxChars/length;
            }
        
            $('#e-search' + id).css('font-size', fontsize);
            $('#search' + id).css('font-size', fontsize);
            $('#searchlocked' + id).css('font-size', fontsize);
        });
    }

    angular.element(document).ready(function() {
        $scope.getChallengeByInstance();

    });

    $scope.alert = function(text) {
        alert(text);
    }

    $scope.closeSearchError = function() {
        $scope.searchError = false;
    }

    $scope.showSearchError = function() {
        $scope.searchError = true;

        var cinterval;
        $scope.timeLeft = 10;
        
        var timeDec = function() {
        $scope.timeLeft--;
        if($scope.timeLeft === 0){
           clearInterval(cinterval);
           $scope.searchError = false;
          
        }
        $scope.$apply(function() {
        $scope.timeLeft;
        })
        
        }
        
        cinterval = setInterval(timeDec, 1000)
     }

    

    // @Deprecated
    $scope.change = function() {

        if (pendingTask) {
            clearTimeout(pendingTask);
        }
        // //console.log("change is occuring");
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

    $scope.posterOverlay1 = false;
    $scope.posterOverlay2 = false;

    $scope.hidePosterOverlay = function(id, source) {
        // //console.log("Hi " + source);
        var ele;
        if (id == 1) {
            ele = 'one';
        } else if (id == 2) {
            ele = 'two';
        } else {
            return false;
        }
        if (source == 'typeahead') {
            // //console.log("I'm true");
            $scope['posterOverlay' + id] = true;
        } else {
            // //console.log("I flipped");
            $scope['posterOverlay' + id] = !$scope['posterOverlay' + id];
        }
        $('.poster .image .overlay .' + ele).attr('hidden', $scope['posterOverlay' + id]);
    }

    $scope.focused1 = false;
    $scope.focused2 = false;

    $scope.isFocused = function(val) {
        //// //console.log("isFocused " + val);
        $scope.closeSearchError();
        if ($scope['focused' + val] == true) {
            $timeout(function() {
                $scope['focused' + val] = false;
                $scope.hidePosterOverlay(val, 'isFocused');
            }, 200)
        } else {
            $scope['focused' + val] = true;
        }
    }
    
    $scope.completeLock = function(){
      var completeLocked = {};
     /*   completeLocked.locked = true;
        $http.put("/api/challenges/" + $routeParams.param, completeLocked );*/

            // //console.log("complete lock");
            $http.get("/api/getchalbyinst/" + $routeParams.param)
                .success(function(response) {

                    // if there is something in the response do a put, otherwise post
                    if (response.length > 0) {

                        chal_id = response[0]._id;

                        completeLocked = {
                            locked: true
                        }

                    }
                      
                        $http.put("/api/challenges/" + chal_id, completeLocked)
                            .success(function(){
                                $scope.getChallengeByInstance();
                            })
                    })

    }

    $scope.challengeContent = null;

    $scope.saveChallenge = function() {
        
        var challenge;
        var chal_id = 0;

        // // //console.log($scope.challenge != challengeContent ? true : false);
        // // //console.log("Is challenge content undefined?" + challengeContent == undefined ? true : false);

        //see if challenge exists yet
        if ($scope.challenge != $scope.challengeContent || $scope.challengeContent == undefined) {
            $scope.challengeContent = $scope.challenge;
            // // //console.log(challengeContent, $scope.challenge)
            // // //console.log("Challenge Saving");
            
            $http.get("/api/getchalbyinst/" + $routeParams.param)
                .success(function(response) {

                    // if there is something in the response do a put, otherwise post
                    if (response.length > 0) {

                        chal_id = response[0]._id;

                        challenge = {
                            challenge: $scope.challenge,
                            date_chal_updated: Date()
                        }
                        // //console.log("Challenge Updated");
                        $http.put("/api/challenges/" + chal_id, challenge)
                            .success(function(){
                                $scope.getChallengeByInstance();
                            })
                    } else  {
                        if ($scope.challenge){
                            challenge = {
                                challenge: $scope.challenge,
                                instance: $routeParams.param
                            }
                        
                            // //console.log("Challenge Saved");

                            $http.post("/api/postchallenge/", challenge)
                                .success(function(data){
                                    $scope.getChallengeByInstance();
                                })
                                .error(function(){
                                    alert('error mothafucka')
                                })
                        }
                        else {
                            // //console.log("Challenge was empty, not saving.")
                        } 
                    }

            });

        } else if ($scope.challenge.length){
        }
    };

    var d;
    var API_URL = 'http://api.themoviedb.org/3/search/movie';
    var API_KEY = '11897eb1c7662904ef04389140fb6638';

    $scope.searchMovies = function(id, term) {

        $scope.searchResults = null;
        // $scope['search' + id] = term;
        if (d) {
            // // //console.log('cancel earlier search, now searching: ' + term);
            d.resolve();
        }
        d = $q.defer();

        var movies = [];
        var searchResults = [];
        var totalPages = 1;
        var promises = [];
        if (!$scope.locked && term != undefined && term.length) {
        $scope.hidePosterOverlay(id, 'typeahead');
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
           // // //console.log('got 1st page')
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
                              // //console.log(response);
                              searchResults.push(response);
                              // //console.log(searchResults);
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
                    //// //console.log(movies);


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
                // // //console.log(response)

                $scope['details' + id] = response;
                $scope['search' + id] = response.title;
                $scope['focused' + id] = false;

                $scope.saveMovie(id);
                typeaheadWait = false;
            }).error(function() {
                // This will null out the search if the typeahead select malfunctions
                // $scope['search' + id] = null;
                // //console.log("There was likely an error with the external API");
                typeaheadWait = false;
            })
        }

        var blurSearch = function(id) {
            // //console.log("fetch fired");
            // //console.log($scope['search' + id]);


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
                    // // //console.log($scope['search' + id]);
                    // // //console.log(response);
                    var tmdb_id = null;
                    // $scope.details1 = response.results[0];

                    var b = function() {
                        // //console.log("Now the search runs by tmdb_id from result.id")
                        $http.jsonp('http://api.themoviedb.org/3/movie/' + tmdb_id, {
                            params: {

                                api_key: '11897eb1c7662904ef04389140fb6638',
                                append_to_response: "id,credits,videos",
                                //page: 1,
                                callback: 'JSON_CALLBACK'
                            }
                        })
                        .success(function(response) {
                            //// //console.log(response)
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
                        // //console.log("Search by movie name from blur had a response length");
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
                                    $scope.showSearchError();
                                    return false;                          
                                } 
                            }
                        })
                    } else {
                        $scope['focused' + id] = false;
                        $scope['search' + id] = null;
                        $scope['details' + id] = null;
                        $scope.showSearchError();
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
        // // //console.log("selectMovie fired from " + source + " and typeahead " + (typeaheadWait ? "is" : "isn't") + " still searching");
        
        //make these variables so toLowerCase() can be applied to them.
        var search_title = $scope['search' + id];
        //details must exist first before setting it.
        if (!$scope.locked) {

            if ($scope['details' + id]) {
                var details_title = $scope['details' + id].title
            };

            if (source == 'typeahead' && tmdb_id && !($scope['details' + id] && tmdb_id == $scope['details' + id].id)) {
                // //console.log("Typeahead is searching");
                typeaheadWait = true;
                typeaheadSearch();

            } else if (!typeaheadWait && (source == 'blur' && $scope['search' + id]) && !($scope['details' + id] && search_title.toLowerCase() == details_title.toLowerCase())) {
                // //console.log("Blur is searching");
                blurSearch(id);

            } 
            // This might be @Deprecated
            else {
                typeaheadWait ? null : // //console.log("no search performed");
                $scope['focused' + id] = false;
                $scope.searchResults = [];
                if ($scope['search' + id] == '') {
                    $scope['details' + id] = null;
                    $scope.saveMovie(id);
                    // //console.log("saving null entry");
                } else {
                    // //console.log("no save performed");
                }

                // $scope['search' + id] = $scope['details' + id].title;
                if (!$scope.search1 || !$scope.search2) {
                    $scope.movieslocked = false;
                }
            }

        }

    }    

    $scope.saveMovie = function(id) {
        var movietitle = {};
        var chalIsLocked;

        // Requiring $scope['details' + id] in the 'if' statements is probably deprecated
        // We aren't calling $scope.selectMovie() on save anymore (thank god), so we shouldn't
        // need to require details to exist before we save?

        // All the validation should occur before saveMovie() fires, therefore $scope.search1
        // should never exist as an invalid entry, allowing a save to fire. saveMovie() validation
        // may be deprecated, but we leave it in for redundancy.

        var save = function(movietitle) {
            // //console.log(window['search' + id])
            // //console.log($scope['search' + id])
            if ((window['search' + id] != undefined && $scope['search' + id] == null) || ($scope['details' + id] && $scope['search' + id] == $scope['details' + id].title && ($scope['search' + id] != window['search' + id] || $scope['details' + id] != window['details' + id] || 'search' + id == undefined))) {
                        // //console.log("Saving Movie " + id);
                        window['details' + id] = $scope['details' + id];
                        window['search' + id] = $scope['search' + id];

                        $http.get("/api/getchalbyinst/" + $routeParams.param)
                            .success(function(response) {
                                angular.forEach(response, function(result) {
                                    chal_id = response[0]._id;
                                });

                             

                                //why does put only seem to work with findbyid in node? why do I have to do the above step and not just find by instance
                                
                                // //console.log(movietitle);
                                $http.put("/api/challenges/" + chal_id, movietitle)
                                    .success(function(data){
                                        // //console.log(movietitle.movieslocked);
                                        // //console.log("Saved Movie " + id);
                                        // //console.log(data);
                                        $scope.getChallengeByInstance();
                                    })
                            });

            }
        }

        if ($scope['search' + id] && $scope['details' + id]) {

            movietitle['movie' + id] = $scope['search' + id],
            movietitle['details' + id] = $scope['details' + id],
            movietitle['user' + id] = id,
            movietitle['movie' + id + "_date_submitted"] = Date(),
            movietitle.movieslocked = false,
            movietitle.challocked = true;


            if ($scope.search1 && $scope.search2){
                movietitle.movieslocked = true;
            }

            save(movietitle);
            
        } else if (!$scope['search' + id].length) {
            movietitle.challocked = false;
            movietitle.movieslocked = false;

            $scope['search' + id] = null;

            if ($scope.search1 != null || $scope.search2 != null){
                movietitle.challocked = true;
            }

            movietitle['movie' + id] = '';
            movietitle['details' + id] = {};

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
                    $scope.locked = response[0].locked;
                    $scope.challocked = response[0].challocked;
                    $scope.movieslocked = response[0].movieslocked;
                    $scope.challengeDate = response[0].date_chal_submitted;
                    $scope.challenge = response[0].challenge;
                    $scope.challengeContent = $scope.challenge;
                    $scope.precomment1 = response[0].precomment1;
                    $scope.postcomment1 = response[0].postcomment1;
                    $scope.precomment2 = response[0].precomment2;
                    $scope.postcomment2 = response[0].postcomment2;
                    $scope.search1 = response[0].movie1;
                    $scope.search2 = response[0].movie2;
                    $scope.details1 = response[0].details1;
                    $scope.details2 = response[0].details2;
                    if ($scope.search1 != null) {
                        window.search1 = $scope.search1;
                    }else {
                        window.search1 = null;
                    }
                    if ($scope.search2 != null) {
                        window.search2 = $scope.search2;
                    }else {
                        window.search2 = null;
                    }

                    $scope.textFill(1);
                    $scope.textFill(2);
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
                    // //console.log("Save comments");
                $http.put("/api/challenges/" + chal_id, comments)

            });

    };

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
    // //console.log($scope.param)
});