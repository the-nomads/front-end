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

    this.postEvent = function (eventToPost, onCompleteCallback) {
        CaveWallAPIService.makeCall("POST", "users/events", null, eventToPost,
        function () {
            // On success
            console.log("Event Posted")
            if (onCompleteCallback) {
                onCompleteCallback();
            }
        },
        function () {
            // On error
        });
    }


}]);