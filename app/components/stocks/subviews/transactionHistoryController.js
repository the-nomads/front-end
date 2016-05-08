var TransactionHistoryController = angular.module("TransactionHistoryController", []);

TransactionHistoryController.controller('TransactionHistoryController',
    ['$scope', '$window', 'StockService', 'AuthService', 'CaveWallAPIService',
        function ($scope, $window, stockService, authService, api) {

            $scope.confirmDelete = false;
            $scope.beginDelete = function () {
                $scope.confirmDelete = true;
            };

            $scope.cancelDelete = function () {
                $scope.confirmDelete = false;
            };

            $scope.completeDeleteAction = function () {
                $scope.confirmDelete = false;
                api.makeCall('DELETE', 'users/financialtransactions', 'all', null, function(){
                  $scope.transactions = null;
                  $scope.$apply();
                }, function() {
                  console.log("couldn't delete transaction history");
                })
            };

            $scope.beginUpload = function () {

            };
        }
    ]
);
