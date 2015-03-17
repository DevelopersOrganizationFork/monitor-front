angular.module('controllers').controller('MainController', 
	['$scope', '$route',
  	function($scope, $route) {
     $scope.$route = $route;
 }]);
