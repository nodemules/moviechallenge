angular.module('movieController', [])

	// inject the Movie service factory into our movieController
	.controller('mainController', ['$scope', '$http', 'Movies', function($scope, $http, Movies){

		// GET =====================================================================
		Movies.get()
		.success(function(data) {

		});

		// CREATE ==================================================================
		$scope.createMovie = function() {

			if ($scope.search1.text != undefined) {

				// call the create functino from our factory
				Movies.create()
					.success(function(data) {
						
					})
			}
		}
	}])