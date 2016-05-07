var MyStocksController = angular.module("MyStocksController", []);

MyStocksController.controller('MyStocksController',
    ['$scope', '$window', 'StockService', 'AuthService', 'CaveWallAPIService',
        function ($scope, $window, stockService, authService, caveWallAPIService) {
          $scope.stocks = [];

          caveWallAPIService.makeCall('GET', 'stocks/owned', null, null, function(stocks) {
            $scope.stocks = stocks;
            $scope.$apply();
          }, function(data) {
            console.log('error getting stocks');
          });
        }
    ]
);
