var TransactionHistoryController = angular.module("TransactionHistoryController", []);

TransactionHistoryController.controller('TransactionHistoryController',
    ['$scope', '$window', 'StockService', 'AuthService', 'CaveWallAPIService',
        function ($scope, $window, stockService, authService, api) {
          $scope.transactions = [];
          api.makeCall('GET', 'users/financialtransactions/all', 'all', null, function(transactions) {
            $scope.transactions = transactions;
            $scope.$apply();
          }, function(data) {
            console.log('error getting transactions');
          });
        }
    ]
);
