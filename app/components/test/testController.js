var TestController = angular.module("TestController", []);

TestController.controller('TestController',
    ['$scope', 'CaveWallAPIService',
        function ($scope, CaveWallAPIService) {
            //'use strict';
            $scope.balance = "Not loaded yet";
            $scope.transactions = [];

            $scope.BuyYahoo = function (callback) {
                $scope.BuyError = null;
                CaveWallAPIService.makeCall("POST", "users/financialtransactions", null,
                    {
                        NumSharesBoughtOrSold: 10,
                        // OUT because we're buying stocks, so money is going OUT of this user's account
                        FinancialTransactionDirection: "OUT",
                        StockName: "YHOO"
                    },
                function (data) {
                    // On success
                    $scope.LoadBalance();
                    $scope.LoadTransactions();
                },
                function (err) {
                    // On error
                    $scope.BuyError = err[0].responseJSON;
                    $scope.$apply();
                });
            }

            $scope.SellYahoo = function (callback) {
                $scope.SellError = null;
                CaveWallAPIService.makeCall("POST", "users/financialtransactions", null,
                    {
                        NumSharesBoughtOrSold: 10,
                        // IN because we're selling stocks, so money is going IN to this user's account
                        FinancialTransactionDirection: "IN",
                        StockName: "YHOO"
                    },
                function (data) {
                    // On success
                    $scope.LoadBalance();
                    $scope.LoadTransactions();
                },
                function (err) {
                    // On error
                    $scope.SellError = err[0].responseJSON;
                    $scope.$apply();
                });
            }
            $scope.DownloadJson = function () {
                var json = {"employees":[
                    {"firstName":"John", "lastName":"Doe"},
                    {"firstName":"Anna", "lastName":"Smith"},
                    {"firstName":"Peter", "lastName":"Jones"}
                ]}

                var serializedJson = JSON.stringify(json);

                localStorage.setItem('testJson',serializedJson);

                var receivedJson = localStorage.getItem('testJson');
                console.log(receivedJson);
                var blob = new Blob([receivedJson],{type: "text/plain;charset=utf-8"})
                saveAs(blob,'event.json');
            }

            $scope.LoadBalance = function () {
                CaveWallAPIService.makeCall("GET", "users/balance", null, null,
                function (data) {
                    // On success
                    console.log("balance: ")
                    console.log(data);
                    $scope.balance = data.Amount;
                    $scope.$apply();
                },
                function () {
                    // On error
                });
            }

            $scope.LoadTransactions = function () {
                CaveWallAPIService.makeCall("GET", "users/financialtransactions", "all", null,
                function (data) {
                    // On success
                    console.log("transactions: ")
                    console.log(data);
                    $scope.transactions = data;
                    $scope.$apply();

                },
                function () {
                    // On error
                });
            }

            $scope.LoadTransactions();
            $scope.LoadBalance();

            $scope.DoOtherThings = function () {
                CaveWallAPIService.makeCall("GET", "stocks", "GOOG", null,
                    function (data) {
                        // On success
                        console.log("GOOG Data: ")
                        console.log(data);

                    },
                    function () {
                        // On error
                    });

                CaveWallAPIService.makeCall("GET", "stocks/owned", null, null,
                    function (data) {
                        // On success
                        console.log("Owned Stocks")
                        console.log(data);

                    },
                    function () {
                        // On error
                    });
            };
        }]);