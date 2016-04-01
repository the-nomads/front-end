
angular.module('OnEnterDirective', []).directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter, { 'event': event });
                });

                event.preventDefault();
            }
        });
    };
});

var angApp = angular.module('angApp', [
    'ngRoute',
    'ngFacebook',

    'HomeController',
    'FacebookLoginController',
    'CalendarController',
    'StockSearchController',
    'WeatherController',

    'WeatherService',
    'StockService',
    'CalendarService',
    'AuthService',
    'CaveWallAPIService',

    'OnEnterDirective',
    'chart.js',
]);


angApp.config(['$routeProvider', '$facebookProvider',
    function ($routeProvider, $facebookProvider) {

        $facebookProvider.setVersion("v2.5");
        $facebookProvider.setAppId("198266390540885");
        $facebookProvider.setPermissions("email,public_profile,user_friends,user_posts");
        $facebookProvider.setCustomInit({
            cookie: true,
        });

        $routeProvider.
            when('/', {
                redirectTo: '/home',
                title: 'Home'
			}).
            when('/home', {
                templateUrl: 'app/components/home/homeView.html',
				controller: 'HomeController',
				title: 'Home',
                activetab: 'home',
            }).
            when('/calendar', {
                templateUrl: 'app/components/calendar/calendarView.html',
                controller: 'CalendarController',
                title: 'Calendar',
                activetab: 'calendar'
            }).
            when('/stockSearch', {
                templateUrl: 'app/components/stockSearch/stockSearchView.html',
                controller: 'StockSearchController',
                title: 'Stock Search',
                activetab: 'stocksearch'
            }).
            when('/weather', {
                templateUrl: 'app/components/weather/weatherView.html',
                controller: 'WeatherController',
                title: 'Weather',
                activetab: 'weather'
            }).
            otherwise({
                redirectTo: '/home',
                title: 'Home'
            });
    }
]);

angApp.run(['$rootScope', '$window', function ($rootScope, $window) {
    // If we've already installed the SDK, we're done
    if (document.getElementById('facebook-jssdk')) { return; }

    // Get the first script element, which we'll use to find the parent node
    var firstScriptElement = document.getElementsByTagName('script')[0];

    // Create a new script element and set its id
    var facebookJS = document.createElement('script');
    facebookJS.id = 'facebook-jssdk';

    // Set the new script's source to the source of the Facebook JS SDK
    facebookJS.src = '//connect.facebook.net/en_US/all.js';

    // Insert the Facebook JS SDK into the DOM
    firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);

    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);

