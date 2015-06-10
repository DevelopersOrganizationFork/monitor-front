var app = angular.module('app', [
    'ngRoute', 'controllers', 'services'
]);

angular.module('services', ['ngResource']);
angular.module('controllers', []);


angular.module('services').factory('Login', ['$resource', function ($resource) {
    return $resource('http\://localhost\:18080/monitor-back/users/login', {
		"login": "@l",
		"password": "@p"
		}, {
		login: {method: 'POST'}
		})
}]);

angular.module('controllers').controller('loginController', [
    '$scope', '$timeout', '$q', 'Login', '$filter',
    function($scope, $timeout, $q, Login, $filter) {
		getSensorsData();
		function getSensorsData() {
	
			
			var result = Login.login({"login": "admin", "password": "admin123"}, function(data) {
				alert('suc');
			});
	
			console.log(result);
		}
	}
]);

