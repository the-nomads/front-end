var calendarService = angular.module('CalendarService', []);

calendarService.service('CalendarService', ['CaveWallAPIService', 'AuthService', function (CaveWallAPIService, authService) {
    //'use strict';

    this.getVisibleDays = function () {
        return { data: "I don't know how we want to do this... probably a Calendar angular js library of some sort..." };
    };

    this.getAllEvents = function (callback) {
        CaveWallAPIService.makeCall("GET", "users/events", "all", null,
        function (data) {
            // On success
            console.log("events: ")
            console.log(data);
            if (callback) {
                callback(data);
            }

        },
        function () {
            // On error
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