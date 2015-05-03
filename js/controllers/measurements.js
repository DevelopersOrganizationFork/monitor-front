angular.module('controllers').controller('measurementsController', [
		'$scope',
		function ($scope) {
			$scope.activeTab = 'measurements';

			// mock data from sensor about memory
			var labels = ['2015-05-03 14:20:00', '2015-05-03 14:20:10', '2015-05-03 14:20:20',
				'2015-05-03 14:20:30', '2015-05-03 14:20:40'];
			$scope.labels = labels.map(function(label) {
				return formatDate(new Date(label));
			});
			$scope.series = ['Memory'];
			$scope.data = [
				[2566, 2700, 3156, 2050, 1900]
			];
			$scope.onClick = function (points, evt) {
				console.log(points, evt);
			};

			function formatDate(date) {
				var hours = date.getHours(),
					minutes = date.getMinutes(),
					seconds = date.getSeconds();
				minutes = minutes < 10 ? '0'+ minutes : minutes;
				seconds = seconds < 10 ? '0'+ seconds : seconds;
				return hours +':'+ minutes +':'+ seconds;
			}

		}
	]);

