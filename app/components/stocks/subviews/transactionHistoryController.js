var TransactionHistoryController = angular.module("TransactionHistoryController", []);

TransactionHistoryController.controller('TransactionHistoryController',
    ['$scope', '$window', 'StockService', 'AuthService', 'CaveWallAPIService',
        function ($scope, $window, stockService, authService, api) {

            $scope.confirmDelete = false;
            $scope.action = "";
            $scope.beginDelete = function () {
                $scope.confirmDelete = true;
                $scope.action = "DELETE";
            };

            $scope.cancelDelete = function () {
                $scope.confirmDelete = false;
                $scope.action = "";
            };

            $scope.beginUpload = function () {
                $scope.confirmDelete = true;
                $scope.action = "UPLOAD";
            };

            $scope.completeDeleteAction = function () {
                $scope.confirmDelete = false;
                if ($scope.action = "DELETE") {
                    $scope.deleteTransctions();
                } else {
                    $scope.deleteTransctions();
                    $scope.uploadTransactions();
                }
                

                $scope.action = "";
            };

            $scope.downloadTransactions = function () {
                stockService.downloadTransactions();
            }
        }
    ]
);
