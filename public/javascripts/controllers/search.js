'use strict';

angular.module('MainApp.Controllers')

.controller('searchController', function($scope, $http) {
        $scope.getMovie = function () {
            console.log('fetch() ran!');
            $http.get("http://www.omdbapi.com/?t=" + $scope.mainsearch + "&tomatoes=true&plot=short")
                .success(function(response) {
                    console.log(response);
                    $scope.details = response;
                });
        };

})

// TMDB API STRING == https://api.themoviedb.org/3/movie?api_key=11897eb1c7662904ef04389140fb6638

/*.controller('typeaheadController', function($scope, $http) {
	$scope.getMovieTypeahead = function(val) {
		return $http.jsonp('https://api.themoviedb.org/3/movie?api_key=11897eb1c7662904ef04389140fb6638', {
			params: {
				query: val
			}
		}).then(function(response) {
			$scope.results = response.data.Title
			console.log(response.data);
			return $scope.results.map(function(item) {
				return item;
			});
		})
	}
})*/

.controller('typeaheadController', ['$scope', 'MovieDB', function($scope, MovieDB){
    $scope.searchText = "";
    $scope.movies = [];

    function refreshSuggestions(newValue, oldValue, scope){
        if (newValue.length > 2){
            MovieDB.searchMovies(newValue).then(function(result){
                $scope.movies = result;
            });
        }
    }

    $scope.$watch('searchText', refreshSuggestions);
}])