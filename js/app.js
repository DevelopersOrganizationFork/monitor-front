var app = angular.module('app', [
    'ngRoute', 'controllers', 'services', 'pascalprecht.translate', 'directives',
	'ngTable', 'ngAnimate'
]);

app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
		.when('/sensors', {
            templateUrl: 'templates/sensors.html',
            controller: 'sensorsController',
			access: {
				requiresLogin: true
			}
        })
		.when('/measurements/:name*', {
			templateUrl: 'templates/measurements.html',
			controller: 'measurementsController',
			access: {
				requiresLogin: true
			}
		})	
		.when('/measType/:name*', {
			templateUrl: 'templates/measType.html',
			controller: 'measTypeController',
			access: {
				requiresLogin: true
			}
		})
		.when('/measurementsList', {
			templateUrl: 'templates/measurementsList.html',
			controller: 'measurementsListController',
			access: {
				requiresLogin: true
			}
		})
		.when('/home', {
			templateUrl: 'templates/home.html',
			controller: 'homeController',
			access: {
				requiresLogin: true
			}
		})
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'loginController'
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
	sensorsUrl: 'http://192.168.243.108:18080/monitor-back/hosts'
});
angular.module('controllers', ['chart.js']);
angular.module('directives', []);
angular.module('services', ['ngResource', 'config']);

Chart.defaults.global.animation = false; // turn on chart animations
