var CalendarController = angular.module("CalendarController", []);

CalendarController.controller('CalendarController',
    ['$scope', '$window', 'CalendarService', 'AuthService', '$location', 'CaveWallAPIService',
        function ($scope, $window, calendarService, authService, $location, CaveWallAPIService) {
            //'use strict';

            $scope.submitEvent = function(newEvent) {
                eventDate = new Date();
                
                // take out newEvents.startMinutes and other fields
                // change them to a date time
                if (newEvent.EventID != null) {
                    // update exiting
                } else {
                    // post new event
                }
            };

            $scope.eventDiscard = function() {
                $scope.newEvent = {}
                // todo hide dialog
            }
            
            //$scope.calendarData = calendarService.getVisibleDays();
            // see http://fullcalendar.io/docs/usage/
            if(authService.getUser() == null) {
                $location.path('/login');
            }

            var me = this; // Use "me" so we don't lose a reference to "this"

    this.refreshCalendar = function () {
        calendarService.getAllEvents(function(evts) {
            

            // make events array

            $("#calendar").fullCalendar({
                header: {
                    left: 'today prev,next',
                    center: '',
                    right: 'title'
                },

                selectable: true,

                // http://fullcalendar.io/docs/google_calendar/
                //googleCalendarApiKey: 'AIzaSyC7jEyslwOpBHRCs2XoDcAE8jRKu3eyCM0',
                events: evts,
                eventClick: function (event) {
                    // opens events in a popup window
                    // take the event object which has start date and enddate and convert them
                    // to minutes hours days etc
                    // event.startMinutes = that
                    $scope.newEvent = event;
                    $('.ui.modal')
                        .modal('show');
                    ;
                    return false;
                },
                dayClick: function (dateInfo) {
                    $scope.newEvent = {
                        EventStartDate: dateInfo._d


                    };

                    // take the event object which has start date and enddate and convert them
                    // to minutes hours days etc
                    // event.startMinutes = that

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
