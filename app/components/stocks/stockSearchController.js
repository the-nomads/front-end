var StockSearchController = angular.module("StockSearchController", []);

StockSearchController.controller('StockSearchController',
    ['$scope', '$window', 'StockService', 'AuthService', '$location', 'CaveWallAPIService',
        function ($scope, $window, stockService, authService, $location, api) {
            //'use strict';
            if(authService.getUser() == null) {
              $location.path('/login');
            }

            $scope.stockSymbolError = null;
            $scope.currentStockSymbol = $location.search().stock;
            $scope.stockDetails = null;
            $scope.hasQuery = false;
            $scope.hasStock = false;
            $scope.stockPurchaseData = null;

            $scope.stocks = [];
            $scope.transactions = [];
            $scope.balance = null;

            $scope.back = function () {
                $scope.currentStockSymbol = null;
                $scope.stockDetails = null;
                $scope.hasQuery = false;
                $scope.hasStock = false;
                $scope.stockPurchaseData = null;
                $location.path('/stocks');
            }

            $scope.loadBalance = function () {
                api.makeCall("GET", "users/balance", null, null,
                function (data) {
                    $scope.balance = data;
                    $scope.$apply();
                },
                function () {
                    // On error
                });
            }

            $scope.loadBalance();

            $scope.loadTransactions = function() {
              api.makeCall('GET', 'users/financialtransactions', 'all', null, function (transactions) {
                  transactions.forEach(function (item, index) {
                      item.TransactionDate = new Date(item.TransactionDate);
                  });
                  $scope.transactions = transactions;
                  $scope.$apply();
              }, function (data) {
                  console.log('error getting transactions');
              });
            }

            $scope.loadTransactions();

            $scope.deleteTransctions = function() {
              api.makeCall('DELETE', 'users/financialtransactions', 'all', null, function(){
                $scope.transactions = null;
                $scope.$apply();
              }, function() {
                console.log("couldn't delete transaction history");
              });
            }

            $scope.loadStocks = function() {
              api.makeCall('GET', 'stocks/owned', null, null, function(stocks) {
                $scope.stocks = stocks;
                $scope.$broadcast('showStocks');
                $scope.$apply();
              }, function(data) {
                console.log('error getting stocks');
              });
            }

            $scope.loadStocks();

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
