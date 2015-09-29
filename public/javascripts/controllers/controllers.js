'use strict';

angular.module('MainApp.Controllers')

.controller('youtubeController', function($scope){
    $scope.$on('youtube-broadcast', function(event, data){
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

    // getChallengeByInstance(); // should only run on instanced pages
    // fetch();

    angular.element(document).ready(function() {
        $scope.getChallengeByInstance();

    });

   /* $scope.$on('youtube-emit', function(event, data){
        // $scope.ytid = "details" + data + ".videos.results[0].key";
        $scope.$broadcast('youtube-broadcast', data);
    })
    
    $scope.$on('youtube-broadcast', function(event, data){
          $scope.ytid = "details" + data + ".videos.results[0].key";
          alert(data);
    })*/
    $scope.alert = function(text){
        alert(text);
    }

    $scope.change = function() {

        if (pendingTask) {
            clearTimeout(pendingTask);
        }
        console.log("change is occuring");
        pendingTask = setTimeout($scope.fetch(id), 800);
    };

    var d;
    var API_URL = 'http://api.themoviedb.org/3/search/movie';
    var API_KEY = '11897eb1c7662904ef04389140fb6638';

    $scope.searchMovies = function(id, term) {
        $scope['search' + id] = term;
        if (d){
            console.log('cancel earlier search, now searching: '+term);
            d.resolve();
        }
        d = $q.defer();

        var movies = [];
        var searchResults = [];
        var totalPages = 1;
        var promises = [];

        // first get, for totalPages
        $http.get(API_URL, {
            params: {
                api_key: API_KEY,
                query: term,
                search_type: 'ngram',
                rnd: Math.random(),   // prevent cache
                //page: 1,
            },
            timeout: d.promise
        }).then(function(result){
            console.log('got 1st page')
            angular.forEach(result.data.results, function(item){
                movies.push(item);
            })
            totalPages = result.data.total_pages;
            var iMax = Math.min(totalPages, 4);    // max pages to get
            for(var i=2; i<=iMax; i++){
                promises.push(
                    $http.get(API_URL, {
                        params: {
                            api_key: API_KEY,
                            query: term,
                            search_type: 'ngram',
                            rnd: Math.random(),   // prevent cache
                            page: i,
                        },
                        timeout: d.promise
                    })
                );
            }
            return $q.all(promises).then(function(results){
                angular.forEach(results, function(resultItem){
                    angular.forEach(resultItem.data.results, function(item){
                        movies.push(item);
                    })
                })
                movies.sort(function(a,b) {
                    return (a.popularity < b.popularity) ? 1 : 
                        ((b.popularity < a.popularity) ? -1 : 0);
                    })

                movies = movies.slice(0,9);
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
                console.log(movies);

                $scope.searchResults = movies;

            });
        });
        return d.promise;
    }

    $scope.typeaheadSearch = function(id, value) {
        var movies = [];
        var options = [];
        $scope['search'+id] = value;
        $http.jsonp('http://api.themoviedb.org/3/search/movie', {
            params: {
                api_key: '11897eb1c7662904ef04389140fb6638',
                query: value,
                search_type: 'ngram',
                append_to_response: "id,credits,videos",
                rnd: Math.random(),   // prevent cache
                page: 1,
                callback: 'JSON_CALLBACK'
            }

            })
            .success(function(response) {
            angular.forEach(response.results, function(item){
                movies.push(item);
            })

            console.log("FIRST 20: ", movies);
           
            var totalPages = response.total_pages;
            var iMax = Math.min(totalPages, 5);
            

            for(var i=2; i<=iMax; i++){
                    $http.jsonp('http://api.themoviedb.org/3/search/movie', {
                        params: {
                            api_key: '11897eb1c7662904ef04389140fb6638',
                            query: value,
                            search_type: 'ngram',
                            append_to_response: "id,credits,videos",
                            rnd: Math.random(),   // prevent cache
                            page: i,
                            callback: 'JSON_CALLBACK'
                        }
                    }).success(function(nextResponse){
                        movies.push(nextResponse.results);

                       
                    })

                    console.log("PAge", i, "Next 20: ", movies);
                
            }

            console.log("All 100: ", movies);
            angular.forEach(options, function(resultItem){
                angular.forEach(resultItem.results, function(item){
                    movies.push(item);
                   })
                })

                movies.sort(function(a,b) {
                    return (a.popularity < b.popularity) ? 1 : 
                        ((b.popularity < a.popularity) ? -1 : 0);
                    })

                movies = movies.slice(0,20);
                $scope.searchResults = movies;                

/*                angular.forEach($scope.searchResults, function(object) {
                   object.searchId = id;
                })*/
                /*$scope.searchId = { searchId : id };
                $scope.searchResults.push($scope.searchId);*/
                console.log("Sorted Results: ", $scope.searchResults);
            })

    }

    $scope.selectMovie = function(id, tmdb_id) {
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
                    $scope['details' + id] = response;
                    $scope['search' + id] = response.title;


                $scope['focused' + id] = false; 
                })  

    }

    $scope.focused1 = false;
    $scope.focused2 = false;

    $scope.updateEditableModel = function(id, val) {
        console.log(val);
        $scope['search'+id] = val;
    }


    $scope.isFocused = function(val) {

        if ($scope['focused' + val] == true) {
            $timeout(function() {        
                $scope['focused' + val] = false;      
            }, 300)
        } else {
            $scope['focused' + val] = true;  
        }
    }

    $scope.fetch = function(id) {
 

            $http.jsonp('http://api.themoviedb.org/3/search/movie', {
            params: {
                api_key: '11897eb1c7662904ef04389140fb6638',
                query: $scope['search' + id],
                search_type: 'ngram',
                append_to_response: "id,credits,videos",
                rnd: Math.random(),   // prevent cache
                //page: 1,
                callback: 'JSON_CALLBACK'
            }

            })
            .success(function(response) {
                // console.log(response);
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
                    //console.log(response)
                    $scope['details' + id] = response;
                })                
            });
        

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
                    $scope.fetch(1);
                    $scope.fetch(2);
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
        if ($scope.challenge){
            $scope.challocked = true;
        }
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
                    if ($scope.challenge){
                        challenge = {
                            challenge: $scope.challenge,
                            date_chal_submitted: Date(),
                            instance: $routeParams.param,
                        }
                    }

                    $http.post("/api/postchallenge/", challenge)

                }

            });

    };


    $scope.saveMovie = function(field) {
        var movietitle;
        if (field == 1 && $scope.search1) {
            movietitle = {
                movie1: $scope.search1,
                user1: "1",
                movie1_postdate: Date()

            }
        }
        if (field == 2 && $scope.search2) {
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