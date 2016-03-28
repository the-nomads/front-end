var facebookLoginController = angular.module("FacebookLoginController", []);

facebookLoginController.controller('FacebookLoginController', ['$scope', '$window', '$facebook', 'AuthService', '$route',
    function ($scope, $window, $facebook, authService, $route) {
        $scope.$route = $route;

        $scope.isLoggedIn = false;
        $scope.login = function () { $facebook.login().then(refresh); }
        $scope.logout = function () {
            $facebook.logout().then(refresh);
        }

        $scope.wall = [];

        function refresh() {
            $facebook.api("/me").then(
              function (user) {
                  $scope.userName = user.name;
                  $scope.facebookUserID = user.id
                  $scope.isLoggedIn = true;
                  authService.setUserLoggedIn(user);
              },
              function (err) {
                  $scope.userName = "";
                  $scope.facebookUserID = "";
                  $scope.isLoggedIn = false;
                  authService.setUserLoggedOut();
              });
        }

        refresh();
}]);