'use strict';

angular.module('MainApp', ['ngRoute', 'ui.bootstrap', 'MainApp.Controllers', 'MainApp.Directives'])

/* Configure usage so we can provide instances via the URL with no hash sign */
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    
    // <3 routeprovider
    $routeProvider
    .when('/', {
            templateUrl: 'index',
            controller: 'indexController'
        })
    .when('/instances/:param', {
            templateUrl: '/challenge',
            controller: 'challengeController'
        })
        .when('/page', {
            templateUrl: 'page'
        })
    .otherwise({redirectTo: '/'}
        );
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);