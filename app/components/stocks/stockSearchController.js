var StockSearchController = angular.module("StockSearchController", []);

StockSearchController.controller('StockSearchController',
    ['$scope', '$window', 'StockService', 'AuthService', '$location',
        function ($scope, $window, stockService, authService, $location) {
            //'use strict';
            if(authService.getUser() == null) {
              $location.path('/login');
            }

            $scope.stockSymbolError = null;
            $scope.currentStockSymbol = $location.search().stock;
            $scope.stockDetails = null;
            $scope.hasQuery = false;

            $scope.stocks = [];

            $scope.back = function () {
                $scope.currentStockSymbol = null;
                $scope.stockDetails = null;
                $scope.hasQuery = false;
                $scope.$apply();
                $location.path('/stocks');
            }

            $scope.stockSearch = function () {
                if ($scope.currentStockSymbol == null || $scope.currentStockSymbol == "") {
                    $scope.stockSymbolError = "Please enter a Stock Symbol to look up";
                    $scope.hasQuery = false;
                } else {
                    $scope.hasQuery = true;
                    $scope.currentStockSymbol =
                        $scope.currentStockSymbol
                        .toUpperCase()
                        .replace(".", ""); // remove "." from punctuation
                    stockService.getStockDetails($scope.currentStockSymbol, function (data) {
                        // Yahoo will send us an object with all null fields
                        // if the stock symbol doesn't exist
                        var AnyNotNull = false;
                        if (data != null) {
                            for (var key in data) {
                                var value = data[key];
                                if (value != null) {
                                    if (value.toUpperCase) {
                                        var toUpper = value.toUpperCase();
                                        if (toUpper != $scope.currentStockSymbol.toUpperCase()) {
                                            AnyNotNull = true;
                                        }
                                    }
                                }
                            }
                        }

                        if (AnyNotNull) {
                            $scope.stockDetails = data;
                            $scope.stockSymbolError = null;
                        } else {
                            $scope.stockDetails = null;
                            $scope.stockSymbolError = 'No data could be found for the stock "' + $scope.currentStockSymbol + '".';
                        }
                        $scope.$broadcast('init');
                        $scope.$apply();
                    }, function () {
                        $scope.stockSymbolError = 'There was an error loading the stock data for the stock "' + $scope.currentStockSymbol + '". Please try again later.';
                        $scope.$apply();
                    });
                }
            };
        }]);
