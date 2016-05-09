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

                if ($scope.action == "DELETE") {
                    $scope.deleteTransctions();
                } else {
                    document.getElementById('transaction-json-file').value = null;
                    transactions = $scope.savingTransactions;
                    stockService.saveNewTransactions(transactions);
                    $scope.loadTransactions();
                    setTimeout(function () { $scope.$apply(); }, 1);
                }
                

                $scope.action = "";
            };

            $scope.downloadTransactions = function () {
                stockService.downloadTransactions();
            }


            $scope.fileErrors = null;
            $scope.checkfile = function () {
                var element = document.getElementById('transaction-json-file');
                var file = element.files[0];

                if (file != null) {
                    var name = file.name;
                    var size = file.size;
                    var type = file.type;

                    if (file.size > 100000) {
                        $scope.fileErrors = "The provided file is too large";
                        $scope.$apply();
                    }
                    else if (file.type != 'application/json' && file.type != "") {
                        $scope.fileErrors = "The provided file is not a proper transaction history file";
                        $scope.$apply();
                    } else {
                        var reader = new FileReader();

                        // Closure to capture the file information.
                        reader.onload = (function (theFile) {
                            if (theFile == null || theFile.target == null || theFile.target.result == null) {
                                $scope.fileErrors = "The provided file is not a proper transaction history file";
                                $scope.$apply();
                            } else {
                                try {
                                    $scope.fileErrors = null;
                                    $scope.$apply();
                                    var content = JSON.parse(theFile.target.result)
                                    if (content == null) {
                                        $scope.fileErrors = "The provided file is not a proper transaction history file";
                                        $scope.$apply();
                                    } else if (!Array.isArray(content)) {
                                        $scope.fileErrors = "The provided file is not a proper transaction history file";
                                        $scope.$apply();
                                    } else {
                                        var err = null;
                                        for (var i in content) {
                                            var transaction = content[i];
                                            if (transaction.Amount == null
                                                || transaction.Currency == null
                                                || transaction.FinancialTransactionDirection == null
                                                || transaction.NumSharesBoughtOrSold == null
                                                || transaction.StockName == null
                                                || transaction.TransactionDate == null) {
                                                err = "The provided file is not a proper transaction history file"
                                            }
                                        }
                                        if (err != null) {
                                            $scope.fileErrors = "The provided file is not a proper transaction history file";
                                            $scope.$apply();
                                        } else {
                                            $scope.beginUpload();
                                            $scope.savingTransactions = content;
                                            $scope.$apply();
                                        }
                                    }
                                } catch (exc) {
                                    $scope.fileErrors = "The provided file is not a proper transaction history file";
                                    $scope.$apply();
                                }
                            }
                        });
                        reader.readAsText(file);
                    }
                } else {
                    $scope.fileErrors = null;
                    $scope.$apply();
                }
            };
        }
    ]
);
var transactions;