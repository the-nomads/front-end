var MyStocksController = angular.module("MyStocksController", []);

MyStocksController.controller('MyStocksController',
    ['$scope', '$window', 'StockService', 'AuthService', 'CaveWallAPIService',
        function ($scope, $window, stockService, authService, api) {

          api.makeCall('GET', 'stocks/owned', null, null, function(stocks) {
            $scope.stocks = stocks;
            $scope.totalShares = 0;
            $scope.totalValue = 0;
            $scope.totalCompanies = $scope.stocks.length;
            $scope.stocks.forEach(function(item, index){
              $scope.totalShares += item.NumberOfStocks;
              $scope.totalValue += (item.NumberOfStocks * item.Quote.Bid);
            });
            console.log(stocks);
            $scope.$apply();
          }, function(data) {
            console.log('error getting stocks');
          });
        }
    ]
);
