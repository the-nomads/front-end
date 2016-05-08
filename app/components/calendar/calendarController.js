var CalendarController = angular.module("CalendarController", []);

CalendarController.controller('CalendarController',
    ['$scope', '$window', 'CalendarService', 'AuthService', '$location', 'CaveWallAPIService',
        function ($scope, $window, calendarService, authService, $location, CaveWallAPIService) {
            //'use strict';
            function setDateField(evt) {
                if (evt.EventStartDate != null) {
                    evt.startHour = evt.EventStartDate.getHours() % 12;
                    if (evt.startHour == 0)
                        evt.startHour = 12;

                    evt.startMinute = evt.EventStartDate.getMinutes();
                    evt.startAmpm = evt.EventStartDate.getHours() > 11 ? "PM" : "AM";
                } else {
                    evt.startHour = 12;
                    evt.startMinute = 0;
                    evt.startAmpm = "PM";
                }

                if (evt.EventEndDate != null) {
                    evt.endHour = evt.EventEndDate.getHours() % 12;
                    if (evt.endHour == 0)
                        evt.endHour = 12;

                    evt.endMinute = evt.EventEndDate.getMinutes();
                    evt.endAmpm = evt.EventEndDate.getHours() > 11 ? "PM" : "AM";
                } else {
                    evt.endHour = 1;
                    evt.endMinute = 0;
                    evt.endAmpm = "PM";
                }
            };

            function setDateTimeField(evt) {
                var starthour = 0;
                if (evt.startAmpm == "AM") {
                    if (evt.startHour == 12) {
                        starthour = 0;
                    } else {
                        starthour = evt.startHour;
                    }
                } else {
                    if (evt.startHour == 12) {
                        starthour = 12;
                    } else {
                        starthour = evt.startHour + 12;
                    }
                }
                evt.EventStartDate = new Date(evt.EventStartDate.setHours(starthour));

                var endhour = 0;
                if (evt.endAmpm == "AM") {
                    if (evt.endHour == 12) {
                        endhour = 0;
                    } else {
                        endhour = evt.endHour;
                    }
                } else {
                    if (evt.endHour == 12) {
                        endhour = 12;
                    } else {
                        endhour = evt.endHour + 12;
                    }
                }
                evt.EventEndDate = new Date(evt.EventEndDate.setHours(endhour));

                evt.EventStartDate = new Date(evt.EventStartDate.setMinutes(evt.startMinute));
                evt.EventEndDate = new Date(evt.EventEndDate.setMinutes(evt.endMinute));
            }

            $scope.eventError = null;
            $scope.eventSubmit = function (newEvent) {
                $scope.eventError = null;
                setDateTimeField(newEvent);
                if (newEvent.EventEndDate < newEvent.EventStartDate) {
                    if (newEvent.EventIsAllDay) {
                        newEvent.EventEndDate = newEvent.EventStartDate
                    } else {
                        $scope.eventError = "The end date must be later than the start date."
                    }
                }

                if (newEvent.EventName == null || newEvent.EventName == "") {
                    $scope.eventError = "You must enter an event name."
                }

                if ($scope.eventError == null) {

                    if (newEvent.EventID != null) {
                        calendarService.updateEvent(newEvent, function () {
                            calendarService.getAllEvents(function (evts) {
                                $("#calendar").fullCalendar('removeEvents');
                                $("#calendar").fullCalendar('addEventSource', events);
                                $("#calendar").fullCalendar('rerenderEvents');
                            });
                        });
                    } else {
                        calendarService.postEvent(newEvent, function () {
                            calendarService.getAllEvents(function (evts) {
                                $("#calendar").fullCalendar('removeEvents');
                                $("#calendar").fullCalendar('addEventSource', events);
                                $("#calendar").fullCalendar('rerenderEvents');
                            });
                        });
                    }

                    $('#event-modal').modal('hide');
                }
            };

            $scope.deleteEvent = function (evt) {
                calendarService.deleteEvent(evt, function () {
                    calendarService.getAllEvents(function (evts) {
                        $("#calendar").fullCalendar('removeEvents');
                        $("#calendar").fullCalendar('addEventSource', events);
                        $("#calendar").fullCalendar('rerenderEvents');
                    });
                });
                $('#event-modal').modal('hide');
            };

            $scope.eventDiscard = function () {
                $scope.newEvent = {};
                $('#event-modal').modal('hide');
            }

            if (authService.getUser() == null) {
                $location.path('/login');
            }

            var me = this; // Use "me" so we don't lose a reference to "this"

            this.refreshCalendar = function () {
                //calendarService.getAllEvents(function(evts) {
                var evts = [];


                // make events array

                $("#calendar").fullCalendar({
                    header: {
                        left: 'today prev,next',
                        center: '',
                        right: 'title'
                    },

                    selectable: true,

                    // http://fullcalendar.io/
                    events: evts,
                    eventClick: function (evt) {
                        $scope.newEvent = evt;
                        setDateField($scope.newEvent);
                        $('#event-modal').modal('show');
                        $scope.$apply();
                        return false;
                    },
                    dayClick: function (dateInfo) {
                        $scope.newEvent = {
                            EventStartDate: dateInfo._d,
                            EventEndDate: dateInfo._d
                        };

                        $scope.newEvent.EventStartDate = new Date($scope.newEvent.EventStartDate.setHours(12));
                        $scope.newEvent.EventEndDate = new Date($scope.newEvent.EventEndDate.setHours(13));


                        setDateField($scope.newEvent);

                        $scope.eventError = null;

                        $scope.$apply();
                        $('#event-modal').modal('show');
                    },
                    loading: function (bool) {
                        $('#loading').toggle(bool);
                    }
                });
                //});
            };

            this.refreshCalendar();
        }]);
