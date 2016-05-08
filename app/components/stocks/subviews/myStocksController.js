var MyStocksController = angular.module("MyStocksController", []);

MyStocksController.controller('MyStocksController',
    ['$scope', '$window', 'StockService', 'AuthService',
        function ($scope, $window, stockService, authService) {
          $scope.totalShares = 0;
          $scope.totalValue = 0;
          $scope.totalCompanies = $scope.stocks.length;
          $scope.stocks.forEach(function(item, index){
            $scope.totalShares += item.NumberOfStocks;
            $scope.totalValue += (item.NumberOfStocks * item.Quote.Bid);
          });
        }
    ]
);
