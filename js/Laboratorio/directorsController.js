app.controller('DirectorsController', ['$scope','$http','$routeParams', '$location', '$localStorage', function($scope, $http, $routeParams, $location, $localStorage) {
  var getMovies, validate;
  $scope.showFilters = false;
  $scope.directores = {};
  $scope.movies = {};
  $scope.filterText = "Mostrar Filtros";
  $scope.modal = {};
  $scope.fil = {};
  $scope.rol = $localStorage.rol === 'admin';

  getDirectors = function(params) {
    $http.get('/directors', {
      params: params
    }).success(function(data) {
        $scope.directores = data;
    });
  };

  $scope.nextPage = function() {
		$scope.page = $scope.page + 1;
    $scope.fil.page = $scope.page;
		$location.search('page', $scope.page);
    getDirectors($scope.fil);
  };

  $scope.prevPage = function() {
  	$scope.page = $scope.page - 1;
    $scope.fil.page = $scope.page;
		$location.search('page', $scope.page);
    getDirectors($scope.fil);
  };

  $scope.viewMovies = function(id, nombre) {
  	$scope.director = nombre;
  	$http.get('/directorMovie', {
  		params: {id: id}
  	}).success(function(data) {
  		$scope.movies = data;
  		$("#modalMovies").modal();
  	});
  };

  $scope.editDirector = function(director) {
    $scope.modal = angular.copy(director);
    $("#editDirector").modal();
  }

  $scope.saveDirector = function() {
    if($scope.modal.NOMBRE && $scope.modal.APELLIDO) {
    var id = $scope.modal.ID;
    delete $scope.modal.ID;
    $http({
      method : 'POST',
      url : '/directors/' + id,
      data: 'data=' + JSON.stringify($scope.modal),
      headers : {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(res) {
      console.log(res)
      if(!res) {
        alert("Hubo un error.")
      } else {
        for(var i in $scope.directores) {
          if($scope.directores[i].ID == id) {
            for(var j in res) {
              $scope.directores[i][j] = res[j];
            }
            break;
          }
        }
        $("#editDirector").modal('hide');
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
    getDirectors($scope.fil);
  }

  $scope.resetFilter = function() {
    $scope.fil = {};
    $scope.fil.page = 1;
    $scope.page = 1 ;
    $location.url($location.path())
    getDirectors($scope.fil);
  }

  var init = function() {
    getDirectors($routeParams);
    $scope.page = parseInt($routeParams.page) || 1;
    $scope.fil.page = $scope.page; 
    for(var i in $routeParams) {
      $scope.fil[i] = $routeParams[i];
    }
  }
  init();
}]);