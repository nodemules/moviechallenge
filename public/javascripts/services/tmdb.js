'use strict';

angular.module('MainApp.Services')

.service('MovieDB', ['$q', '$http', function($q, $http){
    var d;
    var API_URL = 'http://api.themoviedb.org/3/search/movie';
    var API_KEY = '11897eb1c7662904ef04389140fb6638';
    this.searchMovies = function(term) {
        if (d){
            console.log('cancel earlier search, now searching: '+term);
            d.resolve();
        }
        d = $q.defer();

        var movies = [];

        var totalPages = 1;
        var promises = [];

        // first get, for totalPages
        $http.jsonp(API_URL, {
            params: {
                api_key: API_KEY,
                query: term,
                search_type: 'ngram',
                rnd: Math.random(),   // prevent cache
                //page: 1,
                callback: 'JSON_CALLBACK'
            },
            timeout: d.promise
        }).then(function(result){
            console.log('got 1st page')
            angular.forEach(result.data.results, function(item){
                movies.push(item);
            })
            totalPages = result.data.total_pages;
            var iMax = Math.min(totalPages, 1);    // max pages to get
            for(var i=2; i<=iMax; i++){
                promises.push(
                    $http.jsonp(API_URL, {
                        params: {
                            api_key: API_KEY,
                            query: term,
                            search_type: 'ngram',
                            rnd: Math.random(),   // prevent cache
                            // page: i,
                            callback: 'JSON_CALLBACK'
                        },
                        timeout: d.promise
                    })
                );
            }
            return $q.all(promises).then(function(results){
                angular.forEach(results, function(resultItem){
                    angular.forEach(resultItem.data.results, function(item){
                        // console.log('2nd' + resultItem.data.results[1]);
                        movies.push(item);
                    })
                })
                // movies.sort(predicatBy("popularity")).reverse();
                movies = movies.slice(0,10);
                d.resolve(movies);
            });
        });
        return d.promise;
    }
}]);