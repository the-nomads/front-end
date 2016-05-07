var facebookLoginController = angular.module("FacebookLoginController", []);

facebookLoginController.controller('FacebookLoginController', ['$scope', '$location', '$facebook', 'AuthService', '$route',
    function ($scope, $location, $facebook, authService, $route) {
        $scope.$route = $route;
        var user = authService.getUser();
        if(user != null) {
          $scope.userName = authService.getUser().name;
          $scope.facebookUserID = authService.getUser().id;
        }

        $scope.logout = function () {
            $facebook.logout().then(refresh);
        }

        function refresh() {
          $scope.userName = "";
          $scope.facebookUserID = "";
          $scope.isLoggedIn = false;
          authService.setUserLoggedOut();
          $location.path('/login');
        }
}]);
