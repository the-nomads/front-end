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
                $scope.deleteTransctions();
            };

            $scope.beginUpload = function () {

            };
        }
    ]
);
