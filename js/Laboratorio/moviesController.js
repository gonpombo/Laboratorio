app.controller('MoviesController', ['$scope','$http', function($scope, $http) {
    var getMovies, validate;
    $scope.movie = {    };

    getMovies = function() {
        $http.get('/movies').success(function(data) {
            $scope.movies = data;
        });
    };

    getMovies();

    validate = function(movie) {
        var response = true,
        obligatoryFields = ["name", "description", "director", "year", "rating"];

        obligatoryFields.forEach(function(items) {
            if(!movie[items]) {
                response = false;
                $("#" + items).css("border-color", "red");
            } else {
                if(items == "year" && isNaN(movie[items])) {
                    $("#" + items).css("border-color", "red");
                    response = false;
                }
            }
        });
        return response;
    }

    $scope.addMovie = function() {
            if(validate($scope.movie)) {
            $http({
                method : 'POST',
                url : '/movies',
                data: 'data=' + JSON.stringify($scope.movie),
                headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(res){
                $scope.movie = "";
                getMovies();
            }).error(function(a) {
                    alert("Hubo un error.");
                });
        }
    }

    $scope.deleteMovie = function(id) {
       $http.delete('movies/' + id)
           .success(function(data) {
               if(data) {
                   $scope.movies.forEach(function(movie, index) {
                        if(id == movie.id) {
                            $scope.movies.splice(index, 1);
                        }
                   })
               }
       })
           .error (function(err) {
                console.log(err);
       });
    };

    $scope.hasChange = function(a) {
        $("#" + a).css("border-color", "#ccc");
    }
}]);