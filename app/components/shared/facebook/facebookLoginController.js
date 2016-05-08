var facebookLoginController = angular.module("FacebookLoginController", []);

facebookLoginController.controller('FacebookLoginController', ['$scope', '$location', '$facebook', 'AuthService', '$route',
    function ($scope, $location, $facebook, authService, $route) {
        $scope.$route = $route;

        $scope.logout = function () {
            $facebook.logout().then(doLogout);
        }

        authService.doOnLogin('header', function() {
          var user = authService.getUser();
          if(user != null) {
            $scope.userName = authService.getUser().name;
            $scope.facebookUserID = authService.getUser().id;
          }
        });

        function doLogout() {
          $scope.userName = "";
          $scope.facebookUserID = "";
          $scope.isLoggedIn = false;
          authService.setUserLoggedOut();
          $location.path('/login');
        }
}]);
