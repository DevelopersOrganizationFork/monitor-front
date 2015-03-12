var app = angular.module('app', [
    'ngRoute', 'controllers', 'services'
]);

app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
        .when('/sensors', {
            templateUrl: 'templates/sensors.html',
            controller: 'sensorsController'
        })
        .otherwise({
            redirectTo: '/sensors'
        });
    }]);

angular.module('config', []).constant('config', {
    apiUrl: '#url-to-api#'
});
angular.module('controllers', []);
angular.module('services', ['ngResource', 'config']);