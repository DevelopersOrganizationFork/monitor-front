var app = angular.module('app', [
    'ngRoute', 'controllers', 'services'
]);

angular.module('services', ['ngResource']);
angular.module('controllers', []);


angular.module('services').factory('Login', ['$resource', function ($resource) {
    return $resource('http\://10.20.109.23\:18080/monitor-back/users/login', {
		"login": "@l",
		"password": "@p"
		}, {
		login: {method: 'POST'}
		})
}]);

angular.module('controllers').controller('loginController', [
    '$scope', '$timeout', '$q', 'Login', '$filter',
    function($scope, $timeout, $q, Login, $filter ) {
		
	    $scope.validLogin = function(e) {
			if(e.target.value != '') {
				e.target.previousElementSibling.style.opacity=1;
			} else {
				e.target.previousElementSibling.style.opacity=0;
			}
			
			if(e.keyCode==13) {
				e.preventDefault();
			}
		}
		
		$scope.validPass = function(e) {
			if(e.target.value != '') {
				e.target.previousElementSibling.style.opacity=1;
			} else {
				e.target.previousElementSibling.style.opacity=0;
			}
			if(e.keyCode==13) {
				e.preventDefault();
			}
		}
	
		$scope.clickOnLoginBtn = function() {
			var login = document.getElementById('loginInput').value;
			var pass = document.getElementById('passInput').value;
			
			if(login != '' && pass != '') {
				MAX_WIRES=0;
				var back = document.getElementById('background');
				back.style.display="none";
				document.getElementById('background2').style.opacity=1;
				
				document.getElementById('loginForm').style.transition = "opacity 0.3s linear";
				document.getElementById('loginForm').style.opacity=0;
				
				getSensorsData(login, pass).then(function(data) {
					$timeout(function () {
						var i =0, result = '';
						while(data[i]) {
							result += data[i];
							i++;
						}
						if(result === 'LOGIN_OK') {
							lastAnim.lastAnim();
						} else {
							alert("Niepoprawny user/password");
							document.getElementById('loginForm').style.opacity=0.9;
							document.getElementById('background2').style.opacity=0;
							back.style.display="block";
						}
					}, 0);
				});
			}
		}
	
		function getSensorsData(login, pass) {
	
			var d = $q.defer();
	
			Login.login({"login": login, "password": pass}, function(data) {
				 d.resolve(data);
			});
	
			return d.promise;
		}
	}
]);

