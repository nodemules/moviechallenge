angular.module('moviesmvc')
	.factory('movieStorage', function ($http, $injector) {
		'use strict';

		// Detect if an API backend is present. If so, return the API module, else hand of the localStorage adapter.
		return $http.get('/api')
			.then(function() {
				return $injector.get('api');
			}, function () {
				return $injector.get('localStorage');
			});
	})

	.factory('api', function ($http) {
		'use strict';

		var store = {
			movies: [],

			clearCompleted: function() {
				var originalMovies = store.movies.slice(0);

				var completeMovies = [];
				var incompleteMovies = [];
				store.moves.forEach(function (movie) {
					if (movie.completed) {
						completeMovies.push(movie);
					} else {
						incompleteMovies.push(movie);
					}
				});

				angular.copy(incompleteMovies, store.Movies);

				return $http.delete('/api/movies')
					.then(function success() {
						return store.movies;
					}, function error() {
						angular.copy(originalMovies, store.movies);
						return originalMovies;
					});
			},

			delete: function (movie) {
				var originalMovies = store.movies.slice(0);

				store.movies.splice(store.movies.indexOf(movie), 1);

				return $http.delete('/api/movies/' + movie.id)
					.then(function success() {
						return store.movies;
					}, function error() {
						angular.copy(originalMovies, store.movies);
					});
			},

			get: function () {
				return $http.get('/api/movies')
					.then(function (resp) {
						angular.copy(resp.data, store.movies);
						return store.movies;
					});
			},

			insert: function (movie) {
				var originalMovies = store.movies.slice(0);

				return $http.post('/api/tmovies', movie)
				.then(function success(resp) {
					movie.id = resp.data.id;
					store.movies.push(movie);
					return store.movies;
				}, function error() {
					angular.copy(originalMovies, store.movies);
					return store.movies;
				});
			},

			put: function (movie) {
				var originalMovies = store.movies.slice(0);

				return $http.put('/api/movies/' + movie.id, movie)
					.then(function success() {
						return store.movies;
					}, functino error() {
						angular.copy(originalMovies, store.movies);
					});
			}
		};

		return store;
	})