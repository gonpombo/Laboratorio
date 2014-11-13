var app = angular.module('lab', ['ngRoute', 'ngStorage']).config(function($routeProvider){
    $routeProvider
    .when('/', {
      templateUrl: 'templates/main.html',
      controller: 'MainController'
    })  
    .when('/movies', {
    	reloadOnSearch: false,
        templateUrl: 'templates/movies.html',
        controller: 'MoviesController'
    })
   	.when('/actores', {
   		reloadOnSearch: false,
   		templateUrl: 'templates/actors.html',
   		controller: 'ActorsController'
   	})
    .when('/directores', {
      reloadOnSearch: false,
      templateUrl: 'templates/directors.html',
      controller: 'DirectorsController'
    })
    .otherwise({
      redirectTo: '/'
    });
});