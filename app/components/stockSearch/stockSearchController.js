var StockSearchController = angular.module("StockSearchController", []);

StockSearchController.controller('StockSearchController',
    ['$scope', 'StockService', 'AuthService', '$location',
        function ($scope, stockService, authService, $location) {
            //'use strict';

            $scope.stockSymbolError = null;
            $scope.currentStockSymbol = $location.search().stock;
            $scope.stockDetails = null;

            $scope.stockSearch = function () {
                if ($scope.currentStockSymbol == null || $scope.currentStockSymbol == "") {
                    $scope.stockSymbolError = "Please enter a Stock Symbol to look up";
                } else {
                    
                    $scope.currentStockSymbol =
                        $scope.currentStockSymbol
                        .toUpperCase()
                        .replace(".", ""); // remove "." from punctuation
                    stockService.getStockDetails($scope.currentStockSymbol, function (data) {
                        // Yahoo will send us an object with all null fields
                        // if the stock symbol doesn't exist
                        var AnyNotNull = false;
                        if (data != null) {
                            for (var key in data) {
                                var value = data[key];
                                if (value != null) {
                                    if (value.toUpperCase) {
                                        var toUpper = value.toUpperCase();
                                        if (toUpper != $scope.currentStockSymbol.toUpperCase()) {
                                            AnyNotNull = true;
                                        }
                                    }
                                }
                            }
                        }

                        if (AnyNotNull) {
                            $scope.stockDetails = data;
                            $scope.stockSymbolError = null;
                            if (dateRangeSet) {
                                $scope.reloadChart();
                            } else {
                                $scope.setCalendarToMonth();
                            }
                        } else {
                            $scope.stockDetails = null;
                            $scope.stockSymbolError = 'No data could be found for the stock "' + $scope.currentStockSymbol + '".';
                        }

                        $scope.$apply();
                    }, function () {
                        $scope.stockSymbolError = 'There was an error loading the stock data for the stock "' + $scope.currentStockSymbol + '". Please try again later.';
                        $scope.$apply();
                    });
                }
            }

            $scope.chartLoading = false;

            $scope.chartOptions = {
                datasetFill: false,
                pointHitDetectionRadius: 7,
            };

            // Workaround for bug where chart doesn't clear old data
            // https://github.com/jtblin/angular-chart.js/issues/187
            var $chart;
            $scope.$on("create", function (event, chart) {
                if (typeof $chart !== "undefined") {
                    $chart.destroy();
                }
                $chart = chart;
            });

            var dateRangeSet = false;

            $scope.setCalendarToYear = function () {
                dateRangeSet = true;
                var now = new Date();
                var yearInPast = new Date();
                yearInPast.setTime(yearInPast.getTime() + (-366) * 86400000); // subtract 366 days (so we include 365 days)

                $scope.beginDate = $.format.date(yearInPast, 'yyyy-MM-dd');
                $scope.endDate = $.format.date(now, 'yyyy-MM-dd');
                $scope.reloadChart();
            };

            $scope.setCalendarToMonth = function () {
                dateRangeSet = true;
                var now = new Date();
                var monthInPast = new Date();
                monthInPast.setTime(monthInPast.getTime() + (-32) * 86400000); // subtract 32 days (so we include 31 days)

                $scope.beginDate = $.format.date(monthInPast, 'yyyy-MM-dd');
                $scope.endDate = $.format.date(now, 'yyyy-MM-dd');
                $scope.reloadChart();
            };

            $scope.setCalendarToWeek = function () {
                dateRangeSet = true;
                var now = new Date();
                var weekInPast = new Date();
                weekInPast.setTime(weekInPast.getTime() + (-7) * 86400000); // subtract 8 days (so we include 7 days)

                $scope.beginDate = $.format.date(weekInPast, 'yyyy-MM-dd');
                $scope.endDate = $.format.date(now, 'yyyy-MM-dd');
                $scope.reloadChart();
            };

            $scope.anyChartData = false;

            $scope.reloadChart = function () {
                $scope.chartError = null;
                $scope.chartLoading = true;
                $scope.anyChartData = true;

                var beginDateParsed = new Date($scope.beginDate);
                var endDateParsed = new Date($scope.endDate);

                stockService.getStockTimeline($scope.currentStockSymbol, beginDateParsed, endDateParsed, function (data) {

                    if (data == null) {
                        $scope.anyChartData = false;
                        $scope.chartLoading = false;
                        $scope.$apply();
                        return;
                    }

                    $scope.anyChartData = true;

                    $scope.series = ['Open', 'Close', 'High', 'Low'];
                    var labels = [];
                    var dataLow = [];
                    var dataHigh = [];
                    var dataOpen = [];
                    var dataClose = [];

                    data.reverse();

                    var frequency = 1; // Number of days we show
                    // if we group up data sets by this number it should
                    // limit us to 31 maximum points
                    frequency = Math.ceil(data.length / 31); 

                    if (frequency == 1) {
                        for (var i in data) {
                            var timePt = data[i];
                            dataLow.push(timePt.Low);
                            dataHigh.push(timePt.High);
                            dataOpen.push(timePt.Open);
                            dataClose.push(timePt.Close);
                            labels.push(timePt.Date);
                        }
                    } else {
                        var lowSum = 0;
                        var highSum = 0;
                        var openSum = 0;
                        var closeSum = 0;
                        var count = 0;
                        var start = "";

                        for (var i in data) {
                            var timePt = data[i];

                            if (count == 0) {
                                start = timePt.Date;
                            }
                            count++;

                            lowSum += parseFloat(timePt.Low);
                            highSum += parseFloat(timePt.High);
                            openSum += parseFloat(timePt.Open);
                            closeSum += parseFloat(timePt.Close);

                            if (count == frequency) {
                                dataLow.push(lowSum / count);
                                dataHigh.push(highSum / count);
                                dataOpen.push(openSum / count);
                                dataClose.push(closeSum / count);
                                labels.push(start + " - " + timePt.Date);

                                count = 0;
                                lowSum = 0;
                                highSum = 0;
                                openSum = 0;
                                closeSum = 0;
                            }
                        }
                    }

                    $scope.data = [
                        dataOpen,
                        dataClose,
                        dataHigh,
                        dataLow,
                    ];
                    $scope.labels = labels;
                    $scope.chartLoading = false;
                    $scope.$apply();
                }, function () {
                    $scope.chartError = "There was an error loading the stock data. Please try again later.";
                    $scope.chartLoading = false;
                    $scope.$apply();
                });
            };

            $scope.chartError = null;

            // this means that the there was a stock in the location's querystring
            // so automatically do the search
            if ($scope.currentStockSymbol != null) {
                $scope.stockSearch();
                $scope.setCalendarToMonth();
            }
        }]);