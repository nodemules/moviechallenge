angular.module('movieController', [])

	// inject the Movie service factory into our controller
	.controller('mainController', ['$scope', '$http', 'Movies', function($scope, $http, Movies) {
		$scope.formData = {};
		$scope.loading = true;

		// GET =====================================================================
		// when landing on the page, get all movies and show them
		// use the service to get all the movies
		Movies.get()
			.success(function(data) {
				$scope.movies = data;
				$scope.loading = false;
			});
		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createMovie = function() {

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.text != undefined) {
				$scope.loading = true;

				// call the create function from our service (returns a promise object)
				Movies.create($scope.formData)

					// if successful creation, call our get function to get all the new movies
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.movies = data; // assign our new list of movies
					});
			}
		};

		// DELETE ==================================================================
		// delete a movie after checking it
		$scope.deleteMovie = function(id) k{
			$scope.loading = true;

			Movies.delete(id)
				// if successful creation, call our get function to get all the new movies
				.success(function(data) {
					$scope.loading = false;
					$scope.movies = data; // assign our new list of movies
				});
		};
	}]);