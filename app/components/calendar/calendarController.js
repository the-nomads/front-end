var CalendarController = angular.module("CalendarController", []);

CalendarController.controller('CalendarController',
    ['$scope', '$window', 'CalendarService', 'AuthService', '$location',
        function ($scope, $window, calendarService, authService, $location) {
            //'use strict';

            //$scope.calendarData = calendarService.getVisibleDays();
            // see http://fullcalendar.io/docs/usage/
            if(authService.getUser() == null) {
                $location.path('/login');
            }

            var me = this; // Use "me" so we don't lose a reference to "this"

    this.refreshCalendar = function () {
        calendarService.getAllEvents(function() {


        // make events array

            $("#calendar").fullCalendar({
                header: {
                    left: 'today prev,next',
                    center: '',
                    right: 'title'
                },

                selectable: true,

                // http://fullcalendar.io/docs/google_calendar/
                googleCalendarApiKey: 'AIzaSyC7jEyslwOpBHRCs2XoDcAE8jRKu3eyCM0',
                events: 'en.usa#holiday@group.v.calendar.google.com', // US Holidays // pass in here
                eventClick: function (event) {
                    // opens events in a popup window
                    window.open(event.url, 'gcalevent', 'width=700,height=600');
                    return false;
                },
                dayClick: function (dateInfo) {
                    $('.ui.modal')
                        .modal('show');
                    ;
                    calendarService.postEvent({
                        EventName: "TestEvent",
                        EventIsAllDay: false,
                        EventStartDate: dateInfo._d,
                        EventEndDate: new Date(dateInfo._d.getTime() + (1 * 60 * 60 * 1000)),
                    },
                    function () {
                        me.refreshCalendar();
                    }
                    );
                },
                loading: function (bool) {
                    $('#loading').toggle(bool);
                }
            });
        });
    };

            this.refreshCalendar();
        }]);
