var SingleStockViewController = angular.module("SingleStockViewController", []);

SingleStockViewController.controller('SingleStockViewController',
    ['$scope', '$window', 'StockService', 'CaveWallAPIService',
        function ($scope, $window, stockService, api) {
          $scope.chartLoading = false;
          $scope.transactionData = {};
          $scope.chartData = {};
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

          $scope.$on('showStocks', function(e) {
            $scope.stocks.forEach(function(stockItem, index){
                if (stockItem.StockName == $scope.currentStockSymbol) {
                  $scope.hasStock = true;
                  console.log(stockItem);
                  $scope.stockPurchaseData = stockItem;
                  $scope.transactionData.note = stockItem.UserNote;
                $scope.$apply();
                return;
              }
            });
          });

          $scope.$on('init', function(e) {
            var found = false;
            $scope.stocks.forEach(function (stockItem, index) {
                if (stockItem.StockName == $scope.currentStockSymbol) {
                  found = true;
                  console.log(stockItem);
                  $scope.stockPurchaseData = stockItem;
                  $scope.transactionData.note = stockItem.UserNote;
                return;
              }
            });
            $scope.hasStock = found;
            $scope.$apply();
            if (dateRangeSet) {
                $scope.reloadChart();
            } else {
                $scope.setCalendarToMonth();
            }
          });

          $scope.saveNotes = function () {
            api.makeCall('PUT', 'stocks/notes', null, {
              StockName: $scope.currentStockSymbol,
              NoteToPost: $scope.transactionData.note
            }, null, function (data) {
              $scope.transactionData.note = "";
              console.log('error saving note');
              $scope.$apply();
            });
          };

          $scope.doTransaction = function () {
              var value = $('#purchase_selector').dropdown('get value');
              if (value == 'buy' && ($scope.transactionData.shares * $scope.stockDetails.Ask) > $scope.balance.Amount) {
                  $scope.transactionData.error = "Insufficient Funds";
              } else if (value == 'sell' && $scope.transactionData.shares > $scope.stockPurchaseData.NumberOfStocks) {
                  $scope.transactionData.error = "Insufficient Shares";
              } else {
                  if (value == 'buy') {
                      stockService.buyStock($scope.currentStockSymbol, $scope.transactionData.shares,
                          function () {
                                  $scope.loadBalance();
                                  $scope.loadTransactions();
                                  $scope.loadStocks();
                                  $scope.transactionData.shares = null;
                                  $scope.transactionData.error = null;
                          }, function () { });
                  } else {
                      stockService.sellStock($scope.currentStockSymbol, $scope.transactionData.shares,
                            function () {
                                $scope.loadBalance();
                                $scope.loadTransactions();
                                $scope.loadStocks();
                                $scope.transactionData.shares = null;
                                $scope.transactionData.error = null;
                            }, function () { });
                  }
                  //api.makeCall('POST', 'users/financialtransactions', null, {
                  //    NumSharesBoughtOrSold: $scope.transactionData.shares,
                  //    FinancialTransactionDirection: value == 'buy' ? 'OUT' : 'IN',
                  //    StockName: $scope.currentStockSymbol
                  //}, function (data) {
                  //    $scope.loadBalance();
                  //    $scope.loadTransactions();
                  //    $scope.loadStocks();
                  //    $scope.transactionData.shares = null;
                  //    $scope.transactionData.error = null;
                  //}, function (data) {
                  //    console.log('error with stock transaction');
                  //});
              }
          }

          $scope.setCalendarToYear = function () {
              dateRangeSet = true;
              var now = new Date();
              var yearInPast = new Date();
              yearInPast.setTime(yearInPast.getTime() + (-366) * 86400000); // subtract 366 days (so we include 365 days)

              $scope.chartData.beginDate = $.format.date(yearInPast, 'yyyy-MM-dd');
              $scope.chartData.endDate = $.format.date(now, 'yyyy-MM-dd');
              $scope.reloadChart();
          };

          $scope.setCalendarToMonth = function () {
              dateRangeSet = true;
              var now = new Date();
              var monthInPast = new Date();
              monthInPast.setTime(monthInPast.getTime() + (-32) * 86400000); // subtract 32 days (so we include 31 days)

              $scope.chartData.beginDate = $.format.date(monthInPast, 'yyyy-MM-dd');
              $scope.chartData.endDate = $.format.date(now, 'yyyy-MM-dd');
              $scope.reloadChart();
          };

          $scope.setCalendarToWeek = function () {
              dateRangeSet = true;
              var now = new Date();
              var weekInPast = new Date();
              weekInPast.setTime(weekInPast.getTime() + (-7) * 86400000); // subtract 8 days (so we include 7 days)

              $scope.chartData.beginDate = $.format.date(weekInPast, 'yyyy-MM-dd');
              $scope.chartData.endDate = $.format.date(now, 'yyyy-MM-dd');
              $scope.reloadChart();
          };

          $scope.anyChartData = false;

          $scope.reloadChart = function () {
              $scope.chartError = null;
              $scope.chartLoading = true;
              $scope.anyChartData = true;
              var beginDateParsed = new Date($scope.chartData.beginDate);
              var endDateParsed = new Date($scope.chartData.endDate);
              var now = new Date();

              if(beginDateParsed > endDateParsed) {
                console.log()
                $scope.chartError = 'Please select an end date that is before the begin date';
                $scope.chartLoading = false;
                $scope.$apply();
              } else if (beginDateParsed > now ||  endDateParsed > now){
                $scope.chartError = 'Please select a start and end date that have already occurred';
                $scope.chartLoading = false;
                $scope.$apply();
              } else {

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
              }
          };

          $scope.chartError = null;

          // this means that the there was a stock in the location's querystring
          // so automatically do the search
          if ($scope.currentStockSymbol != null) {
              $scope.stockSearch();
              $scope.setCalendarToMonth();
          }
        }
      ]
    );
