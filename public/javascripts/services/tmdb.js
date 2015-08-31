'use strict';

angular.module('MainApp.Services')

.service('MovieDB', ['$q', '$http', function($scope, $q, $http){
    var d;
    var API_URL = 'http://private-7a36d-themoviedb.apiary.io/3/search/movie';
    var API_KEY = '11897eb1c7662904ef04389140fb6638';
    $scope.searchMovies = function(term) {
        if (d){
            console.log('cancel earlier search, now searching: '+term);
            d.resolve();
        }
        d = $q.defer();

        var movies = [];

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
            var iMax = Math.min(totalPages, 9);    // max pages to get
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
                movies.sort(predicatBy("popularity")).reverse();
                movies = movies.slice(0,20);
                d.resolve(movies);
            });
        });
        return d.promise;
    }
}]);