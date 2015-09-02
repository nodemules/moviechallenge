'use strict';

angular.module('MainApp', ['ngRoute', 'ui.bootstrap', 'MainApp.Controllers', 'MainApp.Directives', 'MainApp.Services', 'xeditable'])
    .run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
})


/* Configure usage so we can provide instances via the URL with no hash sign */
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    // <3 routeprovider
    $routeProvider
    .when('/', {
            templateUrl: 'index'
        })
    .when('/instances/:param', {
            templateUrl: '/challenge',
            controller: 'challengeController'
        })
    .when('/search', {
        templateUrl: 'page',
        controller: 'typeaheadController'
        })
    .otherwise({redirectTo: '/'}
        );
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);