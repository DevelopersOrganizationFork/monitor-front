var app = angular.module('app', [
    'ngRoute', 'controllers', 'services', 'pascalprecht.translate', 'directives',
	'ngTable', 'ngAnimate'
]);

app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'loginController'
		})
		.when('/sensors', {
            templateUrl: 'templates/sensors.html',
            controller: 'sensorsController'
        })
		.when('/measurement/:name*', {
			templateUrl: 'templates/measurement.html',
			controller: 'measurementController'
		})	
		.when('/measurementsList', {
			templateUrl: 'templates/measurementsList.html',
			controller: 'measurementsListController'
		})
		.when('/home', {
			templateUrl: 'templates/home.html',
			controller: 'homeController'
		})
        .otherwise({
            redirectTo: '/home'
        });
    }]);

app.config(['$httpProvider', function($httpProvider) {
		$httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
	}
]);

app.config(['$translateProvider', function ($translateProvider) {
		$translateProvider.useStaticFilesLoader({
			prefix: '/i18n/lang-',
			suffix: '.json'
		});
		$translateProvider.preferredLanguage("en_US");			
	}]);

angular.module('config', []).constant('config', {
    apiUrl: 'http://localhost:18080/monitor-back/fake/hosts/2/',
	sensorsUrl: 'http://localhost:18080/monitor-back/hosts',
    sensorsFakeUrl: 'http://localhost:18080/monitor-back/fake/hosts'
});
angular.module('controllers', ['chart.js']);
angular.module('directives', []);
angular.module('services', ['ngResource', 'config']);

Chart.defaults.global.animation = false; // turn off chart animations
