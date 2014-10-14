app.controller('ActorsController', ['$scope','$http','$routeParams', '$location', '$localStorage', function($scope, $http, $routeParams, $location, $localStorage) {
  var getMovies, validate;
  $scope.showFilters = false;
  $scope.actores = {};
  $scope.movies = {};
  $scope.filterText = "Mostrar Filtros";
  $scope.modal = {};
  $scope.fil = {};
  $scope.rol = $localStorage.rol === 'admin';

  getActors = function(params) {
    $http.get('/actors', {
      params: params
    }).success(function(data) {
        $scope.actores = data;
    });
  };

  $scope.nextPage = function() {
		$scope.page = $scope.page + 1;
    $scope.fil.page = $scope.page;
		$location.search('page', $scope.page);
    getActors($scope.fil);
  };

  $scope.prevPage = function() {
  	$scope.page = $scope.page - 1;
    $scope.fil.page = $scope.page;
		$location.search('page', $scope.page);
    getActors($scope.fil);
  };

  $scope.viewMovies = function(id, nombre, apellido) {
  	$scope.movie = nombre +  ' ' + apellido;
  	$http.get('/actorMovie', {
  		params: {id: id}
  	}).success(function(data) {
  		$scope.movies = data;
  		$("#modalMovies").modal();
  	});
  };

  $scope.editActor = function(actor) {
    $scope.modal = angular.copy(actor);
    $("#editActor").modal();
  }

  $scope.saveActor = function() {
    if($scope.modal.NOMBRE && $scope.modal.APELLIDO) {
    var id = $scope.modal.ID;
    delete $scope.modal.ID;
    $http({
      method : 'POST',
      url : '/actors/' + id,
      data: 'data=' + JSON.stringify($scope.modal),
      headers : {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(res) {
      console.log(res)
      if(!res) {
        alert("Hubo un error.")
      } else {
        for(var i in $scope.actores) {
          if($scope.actores[i].ID == id) {
            for(var j in res) {
              $scope.actores[i][j] = res[j];
            }
            break;
          }
        }
        $("#editActor").modal('hide');
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
    getActors($scope.fil);
  }

  $scope.resetFilter = function() {
    $scope.fil = {};
    $scope.fil.page = 1;
    $scope.page = 1 ;
    $location.url($location.path())
    getActors($scope.fil);
  }

  var init = function() {
    getActors($routeParams);
    $scope.page = parseInt($routeParams.page) || 1;
    $scope.fil.page = $scope.page; 
    for(var i in $routeParams) {
      $scope.fil[i] = $routeParams[i];
    }
  }
  init();
}]);