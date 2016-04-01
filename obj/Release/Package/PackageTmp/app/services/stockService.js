var stockService = angular.module('StockService', []);

stockService.service('StockService', [function () {
    //'use strict';

    this.defaultStocks = ["GOOG", "YHOO", "AAPL", "AMZN", "MSFT"];

    this.baseUrl = "http://query.yahooapis.com/v1/public/yql";
    this.urlAppendDetail = "&format=json&env=http://datatables.org/alltables.env";
    this.urlAppendTimeline = "&format=json&env=store://datatables.org/alltableswithkeys&callback=";

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