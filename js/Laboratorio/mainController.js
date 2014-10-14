app.controller('MainController', ['$scope', '$localStorage','$location', function($scope, $localStorage, $location) {
	$scope.setRole = function(rol) {
		$localStorage.rol = rol;
		$location.url('/actores');
	};
}]);