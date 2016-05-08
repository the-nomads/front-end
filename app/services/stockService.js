var stockService = angular.module('StockService', []);

stockService.service('StockService', ['CaveWallAPIService', function (CaveWallAPIService) {
    //'use strict';

    this.defaultStocks = ["GOOG", "YHOO", "AAPL", "AMZN", "MSFT"];

    this.baseUrl = "http://query.yahooapis.com/v1/public/yql";
    this.urlAppendDetail = "&format=json&env=http://datatables.org/alltables.env";
    this.urlAppendTimeline = "&format=json&env=store://datatables.org/alltableswithkeys&callback=";


    this.getTransactions = function() {
        var transactions = JSON.parse(localStorage.getItem("financialTransactions"));
        if (transactions == null) {
            transactions = [];
            SaveTransactions(transactions);
        }
        return transactions;
    }

    this.downloadTransactions = function () {
        var transactions = this.getTransactions();
        var blob = new Blob([JSON.stringify(transactions)], { type: "application/json" })
        saveAs(blob, 'financialtransactions.json');
    };

    function SaveTransactions(transactions) {
        localStorage.setItem("financialTransactions", JSON.stringify(transactions));
    }

    var loadTransactions = this.getTransactions;

    function buyOrSellStock(direction, stockSymbol, numStocks, onSuccess, onError) {
        CaveWallAPIService.makeCall("POST", "users/financialtransactions", null,
            {
                NumSharesBoughtOrSold: numStocks,
                FinancialTransactionDirection: direction,
                StockName: stockSymbol
            },
        function (financialTransaction) {
            // On success

            var transactions = loadTransactions();
            transactions.push(financialTransaction);
            SaveTransactions(transactions);

            if (onSuccess) {
                onSuccess(financialTransaction);
            };
        },
        function (err) {
            // On error
            if (onError) {
                onError(err[0].responseJSON);
            }
        });
    }

    this.deleteTransactions = function() {
        SaveTransactions([]);
    }

    this.buyStock = function (stockSymbol, numStocks, onSuccess, onError) {
        // OUT because we're buying stocks, so money is going OUT of this user's account
        buyOrSellStock("OUT", stockSymbol, numStocks, onSuccess, onError);
    };

    this.sellStock = function (stockSymbol, numStocks, onSuccess, onError) {
        // IN because we're selling stocks, so money is going IN to this user's account
        buyOrSellStock("IN", stockSymbol, numStocks, onSuccess, onError);
    };

    this.getStockTicker = function (callback, onError) {
        this.getStockDetailsMany(this.defaultStocks, callback, onError)
    };

    this.getStockDetails = function (stockSymbol, callback, onError) {
        var arr = [];
        arr.push(stockSymbol);
        this.getStockDetailsMany(arr, callback, onError);
    };

    this.getStockDetailsMany = function (symbols, callback, onError) {
        var query = "select * from yahoo.finance.quotes where symbol in ("

        for (var i in symbols) {
            var stockSymbol = symbols[i];
            query += '"' + stockSymbol + '"';
            if (i < symbols.length - 1)
                query += ",";
        }

        query += ")";
        this.executeQuery(query, true, function (data) {
            if (data == null || data.query == null || data.query.results == null || data.query.results.quote == null) {
                callback(null);
            } else {
                callback(data.query.results.quote);
            }
        }, onError);
    };

    this.getStockTimeline = function (symbol, startDate, endDate, callback, onError) {

        if (endDate > startDate) {
            var swap = endDate;
            endDate = startDate;
            startDate = swap;
        }

        var query = 'select * from yahoo.finance.historicaldata where symbol = "' + symbol
            + '" and startDate = "' + $.format.date(endDate, 'yyyy-MM-dd') +
            '" and endDate = "' + $.format.date(startDate, 'yyyy-MM-dd') + '"';

        this.executeQuery(query, false, function (data) {
            if (data == null || data.query == null || data.query.results == null || data.query.results.quote == null) {
                callback(null); // callback with null
            } else {
                callback(data.query.results.quote);
            }
        }, onError);
    };

    this.executeQuery = function (query, isDetail, callback, onError) {
        $.ajax({
            url: this.baseUrl + "?q=" + encodeURIComponent(query) + (isDetail ? this.urlAppendDetail : this.urlAppendTimeline),
            cache: false,
            crossDomain: true,
            dataType: 'json',
            method: 'GET',
            success: function (result) {
                if (callback != null) {
                    callback(result);
                }
            },
            error: function () {
                if (onError != null) {
                    onError();
                }
            }
        });
    };
}]);