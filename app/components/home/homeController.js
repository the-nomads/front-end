var HomeController = angular.module("HomeController", []);

HomeController.controller('HomeController',
    ['$scope', '$location', 'WeatherService', 'StockService', 'AuthService', 'CaveWallAPIService',
        function ($scope, $location, weatherService, stockService, authService, caveWallAPIService) {
            //'use strict';
            if(authService.getUser() == null) {
              $location.path('/login');
            }

            $scope.stocks = [];
            caveWallAPIService.makeCall('GET', 'stocks/owned', null, null, function(stocks) {
              $scope.stocks = stocks;
              $scope.$apply();
              $('.stock').each(function(index){
                var child = $(this).find('.change');
                if(child.text().includes('-'))
                  child.addClass('negative');
                else if (child.text().includes('+'))
                  child.addClass('positive');
              });
            }, function(data) {
              console.log('error getting stocks');
            });

            $scope.loggedIn = false;
            authService.doOnLogin('homeControllerLogin', function (user) {
                $scope.loggedIn = true;
                $scope.facebookUserID = user.id;
                authService.getUserFeed(function (userWall) {
                    $scope.wall = userWall.data;
                });
            });

            authService.doOnLogout('homeControllerLogout', function () {
                $scope.loggedIn = false;
                $scope.wall = [];
            });

            $scope.message = "";
            $scope.doPost = function() {
              console.log($scope.message);
              if($scope.message != "") {
                authService.postToWall(function(data){
                  $scope.message = "";
                  $scope.$apply();
                  console.log(data);
                }, $scope.message);
              }
            }

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
