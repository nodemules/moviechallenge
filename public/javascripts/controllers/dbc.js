// test file to write interactions between angular and node api

var app = angular.module('dbApp', [])

	.controller('dbController', function($scope, $http) {
		
		// saves a single movie to the db when button ng-click=saveMovie() is run
		// functional, implemented in search.js
		$scope.saveMovie = function() {
			var movietitle = {
				name : ' ' 			// the movie title goes here, $scope.searchx works but 
									// ideally we'd like to populate from the API search
									// response, so we can get additional data from API in our db?
			}

			$http.post("/api/movies", movietitle)
				.success(function(response) {
					return response;
			          if (err)
					res.send(err);

					res.json({ message: 'Movie saved!' });
			});
		};

		// gets all movies to display with ng-repeat, perhaps
		$scope.getallMovies = function() {

			$http.get("/api/movies")
				.success(function(data) {
					$scope.allmovies = data;
				});
		};

		$scope.getMovie = function() {

			$http.get("/api/movies/:movie_id", movies)
				.success(function(data) {
					res.json(movies);
				});
		};

	});