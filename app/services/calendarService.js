var calendarService = angular.module('CalendarService', []);

calendarService.service('CalendarService', ['CaveWallAPIService', 'AuthService', function (CaveWallAPIService, authService) {
    //'use strict';

    this.getVisibleDays = function () {
        return { data: "I don't know how we want to do this... probably a Calendar angular js library of some sort..." };
    };

    this.getAllEvents = function (callback, onError) {
        CaveWallAPIService.makeCall("GET", "users/events", "all", null,
        function (data) {
            // On success
            var resultData = [];

            if (data != null) {
                for (var i in data) {
                    var evt = data[i];
                    evt.title = evt.EventName;
                    evt.start = evt.EventStartDate;
                    evt.end = evt.EventEndDate;
                    evt.allDay = evt.EventIsAllDay;
                    evt.EventStartDate = new Date(evt.EventStartDate);
                    evt.EventEndDate = new Date(evt.EventEndDate);
                    evt.isToday = (evt.EventStartDate.toDateString() == new Date().toDateString());
                    if (!evt.IsDeleted) {
                        resultData.push(evt);
                    }
                }
            }
            if (callback) {
                callback(resultData);
            }

        },
        function () {
            // On error
            if (onError) {
                onError();
            }
        });
    }

    this.getAllFutureEvents = function (callback, onError) {
        CaveWallAPIService.makeCall("GET", "users/events", "all", null,
        function (data) {
            // On success
            var resultData = [];

            if (data != null) {
                for (var i in data) {
                    var evt = data[i];
                    evt.title = evt.EventName;
                    evt.start = evt.EventStartDate;
                    evt.end = evt.EventEndDate;
                    evt.allDay = evt.EventIsAllDay;
                    evt.EventStartDate = new Date(evt.EventStartDate);
                    evt.EventEndDate = new Date(evt.EventEndDate);
                    evt.isToday = (evt.EventStartDate.toDateString() == new Date().toDateString());
                    if (!evt.IsDeleted && evt.EventStartDate >= new Date()) {
                        resultData.push(evt);
                    }
                }
            }
            if (callback) {
                callback(resultData);
            }

        },
        function () {
            // On error
            if (onError) {
                onError();
            }
        });
    }

    this.postEvent = function (eventToPost, onCompleteCallback) {
        CaveWallAPIService.makeCall("POST", "users/events", null, eventToPost,
        function () {
            if (onCompleteCallback) {
                onCompleteCallback();
            }
        },
        function () {
            if (onCompleteCallback) {
                onCompleteCallback();
            }
            // On error
        });
    }

    this.updateEvent = function (eventToPost, onCompleteCallback) {


        CaveWallAPIService.makeCall("PUT", "users/events", eventToPost.EventID, eventToPost,
        function () {
            // On success
            if (onCompleteCallback) {
                onCompleteCallback();
            }
        },
        function () {
            // On error
            if (onCompleteCallback) {
                onCompleteCallback();
            }
        });
    }

        this.deleteEvent = function (eventToPost, onCompleteCallback) {
        CaveWallAPIService.makeCall("DELETE", "users/events", eventToPost.EventID, null,
        function () {
            // On success
            if (onCompleteCallback) {
                onCompleteCallback();
            }
        },
        function () {
            // On error
            if (onCompleteCallback) {
                onCompleteCallback();
            }
        });
    }


}]);
