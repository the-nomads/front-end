var HomeController = angular.module("HomeController", []);

HomeController.controller('HomeController',
    ['$scope', 'WeatherService', 'StockService', 'AuthService',
        function ($scope, weatherService, stockService, authService) {
            //'use strict';

            $scope.stocks = [];

            stockService.getStockTicker(function (stocks) {
                $scope.stocks = stocks;
                $scope.$apply();
            });

            $scope.loggedIn = false;
            authService.doOnLogin('homeControllerLogin', function (user) {
                $scope.loggedIn = true;
                authService.getUserFeed(function (userWall) {
                    $scope.wall = userWall.data;
                });
            });

            authService.doOnLogout('homeControllerLogout', function () {
                $scope.loggedIn = false;
                $scope.wall = [];
            });



            $scope.zipError = false;
            $scope.currentZipCode = weatherService.getCurrentZipCode();

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

            $scope.saveZip = function () {
                weatherService.setUserDefaultZipCode($scope.currentZipCode);
            };

            $scope.weatherUpdate();

        }]);