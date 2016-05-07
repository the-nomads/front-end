var LoginController = angular.module("LoginController", []);

LoginController.controller('LoginController',
    ['$scope', '$location', '$facebook', 'AuthService', '$route',
        function ($scope, $location, $facebook, authService, $route) {
            $scope.isLoggedIn = false;
            $scope.login = function () { $facebook.login().then(refresh); }

            $scope.wall = [];

            function refresh() {
                $facebook.api("/me").then(
                  function (user) {
                      authService.setUserLoggedIn(user);
                      $('#navbar').css('display', '');
                      $('#container').removeClass('login grid').addClass('container segment secondary');
                      $('#view').removeClass('column');
                      $location.path('/home');
                  },
                  function (err) {
                  });
            }
            refresh();
        }]);
