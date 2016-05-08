var HomeController = angular.module("HomeController", []);

HomeController.controller('HomeController',
    ['$scope', '$location', 'WeatherService', 'StockService', 'AuthService', 'CaveWallAPIService', 'CalendarService',
        function ($scope, $location, weatherService, stockService, authService, caveWallAPIService, calendarService) {
            //'use strict';
            if(authService.getUser() == null) {
              $location.path('/login');
            }

            $scope.events = [];
            $scope.eventsLoaded = false;
            calendarService.getAllEvents(function (data) {
                $scope.events = data;
                $scope.eventsLoaded = true;
                $scope.$apply();
            }, function() {
                $scope.eventsLoaded = true;
                $scope.$apply();
            });

            $scope.stocks = [];
            $scope.stocksLoaded = false;
            caveWallAPIService.makeCall('GET', 'stocks/owned', null, null, function (stocks) {
                var stockarr = [];
                for (var i in stocks) {
                    if (stocks[i].NumberOfStocks > 0) {
                        stockarr.push(stocks[i]);
                    }
                }
                $scope.stocks = stockarr;
                $scope.stocksLoaded = true;
                $scope.$apply();
              $('.stock').each(function(index){
                var child = $(this).find('.change');
                if(child.text().includes('-'))
                  child.addClass('negative');
                else if (child.text().includes('+'))
                  child.addClass('positive');
              });
            }, function(data) {
                $scope.stocksLoaded = true;
                $scope.$apply();
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

            $scope.doPost = function () {
                if ($scope.message != "") {
                    authService.postToWall(function (data) {
                        $scope.message = "";
                        setTimeout(function () { $scope.$apply(); }, 1);
                        authService.getUserFeed(function (userWall) {
                            $scope.wall = userWall.data;
                        });
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
