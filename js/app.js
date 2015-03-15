var app = angular.module('app', [
    'ngRoute', 'controllers', 'services', 'pascalprecht.translate', 'directives'
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
        .otherwise({
            redirectTo: '/sensors'
        });
    }]);

app.config(['$translateProvider', function ($translateProvider) {
		$translateProvider.useStaticFilesLoader({
			prefix: '/i18n/lang-',
			suffix: '.json'
		});
		$translateProvider.preferredLanguage("en_US");			
	}]);

angular.module('config', []).constant('config', {
    apiUrl: '#url-to-api#'
});
angular.module('controllers', []);
angular.module('directives', []);
angular.module('services', ['ngResource', 'config']);