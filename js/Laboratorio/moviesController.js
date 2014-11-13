app.controller('MoviesController', ['$scope','$http','$routeParams','$localStorage', '$location', function($scope, $http, $routeParams, $localStorage, $location) {
  var getMovies, validate;
  $scope.showFilters = false;
  $scope.actores = {};
  $scope.directores = {};
  $scope.movies = {};
  $scope.filterText = "Mostrar Filtros";
  $scope.modal = {};
  $scope.fil = {};
  $scope.rol = $localStorage.rol === 'admin';

  getMovies = function(params) {
    $http.get('/movies', {
      params: params
    }).success(function(data) {
      $scope.movies = data;
    });
  };

  $scope.nextPage = function() {
    $scope.page = $scope.page + 1;
    $scope.fil.page = $scope.page;
    $location.search('page', $scope.page);
    getMovies($scope.fil);
  };

  $scope.prevPage = function() {
    $scope.page = $scope.page - 1;
    $scope.fil.page = $scope.page;
    $location.search('page', $scope.page);
    getMovies($scope.fil);
  };

  $scope.viewActors = function(id, nombre, apellido) {
    $scope.movie = nombre +  ' ' + apellido;
    $http.get('/movieActor', {
      params: {id: id}
    }).success(function(data) {
      $scope.actors = data;
      $("#modalActors").modal();
    });
  };

  $scope.editMovie = function(movie) {
    $scope.modal = angular.copy(movie);
    $("#editMovie").modal();
  }

  $scope.saveMovie = function() {
    if($scope.modal.NOMBRE && $scope.modal.ANIO) {
    var id = $scope.modal.ID;
    delete $scope.modal.ID;
    $http({
      method : 'POST',
      url : '/movies/' + id,
      data: 'data=' + JSON.stringify($scope.modal),
      headers : {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(res) {
      console.log(res)
      if(!res) {
        alert("Hubo un error.")
      } else {
        for(var i in $scope.movies) {
          if($scope.movies[i].ID == id) {
            for(var j in res) {
              $scope.movies[i][j] = res[j];
            }
            break;
          }
        }
        $("#editMovie").modal('hide');
      }
    }).error(function(a) {
        alert("Hubo un error.");
      });
    }
  }

  $scope.validate = function(obj) {
    return obj ? "" : "has-error has-feedback";
  }

  $scope.toggleFilter = function() {
    $scope.showFilters = !$scope.showFilters;
    $scope.filterText = $scope.showFilters ? "Ocultar Filtros" : "Mostrar Filtros";
  };

  $scope.setFilter = function() {
    $scope.page = 1;
    $scope.fil.page = 1;
    for(var i in $scope.fil) {
      $location.search(i, $scope.fil[i]);
    }
    getMovies($scope.fil);
  }

  $scope.resetFilter = function() {
    $scope.fil = {};
    $scope.fil.page = 1;
    $scope.page = 1 ;
    $location.url($location.path())
    getMovies($scope.fil);
  }

  var init = function() {
    getMovies($routeParams);
    $scope.page = parseInt($routeParams.page) || 1;
    $scope.fil.page = $scope.page; 
    for(var i in $routeParams) {
      $scope.fil[i] = $routeParams[i];
    }
  }

  init();
}]);