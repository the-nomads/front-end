var TransactionHistoryController = angular.module("TransactionHistoryController", []);

TransactionHistoryController.controller('TransactionHistoryController',
    ['$scope', '$window', 'StockService', 'AuthService', 'CaveWallAPIService',
        function ($scope, $window, stockService, authService, api) {
          $('.button.action').popup();
          $scope.transactions = [];
          api.makeCall('GET', 'users/financialtransactions', 'all', null, function(transactions) {
            transactions.forEach(function(item, index) {
              item.TransactionDate = new Date(item.TransactionDate);
            });
            $scope.transactions = transactions;
            $scope.$apply();
          }, function(data) {
            console.log('error getting transactions');
          });
        }
    ]
);
