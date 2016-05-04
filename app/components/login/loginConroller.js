var HomeController = angular.module("LoginController", []);

HomeController.controller('LoginController',
    ['$scope', 'AuthService',
        function ($scope, authService) {
            //'use strict';

            $scope.loggedIn = false;
            authService.doOnLogin('homeControllerLogin', function (user) {
                $scope.loggedIn = true;
                authService.getUserFeed(function (userWall) {
                    $scope.wall = userWall.data;
                });
            });
        }]);
