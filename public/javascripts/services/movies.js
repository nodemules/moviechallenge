angular.module('movieService', [])

	// each function returns a promise object
	.factory('Movies', ['$http',function($http){
		return {
			get : function() {
				return $http.get('/api/movies');
			},
			create : function(movieData) {
				return $http.post('/api/movies', movieData);
			},
			delete : function(id) {
				return $http.delete('/api/movies/' + id);
			}
		}
	}]);