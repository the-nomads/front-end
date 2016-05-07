var WeatherController = angular.module("WeatherController", []);

WeatherController.controller('WeatherController',
    ['$scope', '$window', 'WeatherService', 'AuthService', '$location',
        function ($scope, $window, weatherService, authService, $location) {
            if(authService.getUser() == null) {
              $location.path('/login');
            }

            $scope.zipError = false;

            $scope.currentZipCode = $location.search().weatherZip;
            if ($scope.currentZipCode == null) {
                $scope.currentZipCode = weatherService.getCurrentZipCode();
            }

            $scope.validateZip = function () {
                var isnum = /^\d+$/.test($scope.currentZipCode);
                if (!isnum || isNaN(parseInt($scope.currentZipCode, 10)) || $scope.currentZipCode.length != 5) {
                    return false;
                }
                return true;
            }

            $scope.weatherUpdate = function () {
                if (!$scope.validateZip()) {
                    $scope.zipError = true;
                } else {
                    $scope.zipError = false;

                    weatherService.getWeather($scope.currentZipCode, function (weather) {
                        $scope.weather = weather;
                        $scope.$apply();
                    });
                }
            };

            $scope.weatherUpdate();


            $scope.saveZip = function () {
                weatherService.setUserDefaultZipCode($scope.currentZipCode);
            };
}]);
