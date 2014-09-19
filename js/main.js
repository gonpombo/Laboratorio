var app = angular.module('lab', ['ngRoute']).config(function($routeProvider){
    $routeProvider
        .when('/movies', {
            templateUrl: 'templates/movies.html',
            controller: 'MoviesController'
        })
       	.when('/actores', {
       		templateUrl: 'templates/actors.html',
       		controller: 'ActorsController'
       	})
});