angular.module('controllers').controller('measurementsController', [
		'$scope', '$timeout', '$q', 'Measurement',
		function ($scope, $timeout, $q, Measurement) {
			$scope.activeTab = 'measurements';
			var measurements;


			function onDataFetchSuccess() {
				var data;
				$scope.labels = measurements.map(function(measurement) {
					return formatDate(new Date(measurement.date));
				});
				$scope.series = ['CPU'];
				data = measurements.map(function(measurement) {
					return measurement.value;
				});
				$scope.data = [data];
			}

			getData()
				.then(function() {
					$timeout(function () {
						onDataFetchSuccess();
					}, 0);
				});

			function getData() {
				var d = $q.defer();
				//Measurement.query({type: 'CPU'}, function (data) {
				//	measurements = data;
				//    d.resolve();
				//});

				// MOCK MOCK
				measurements = [{"date":1430828269469,"type":"CPU","value":52},
					{"date":1430828269470,"type":"CPU","value":83},
					{"date":1430828269471,"type":"CPU","value":26},
					{"date":1430828269472,"type":"CPU","value":33},
					{"date":1430828269473,"type":"CPU","value":18},
					{"date":1430828269473,"type":"CPU","value":15},
					{"date":1430828269474,"type":"CPU","value":59,"description":"complex memory"},
					{"date":1430828269475,"type":"CPU","value":2,"description":"complex cpu"},
					{"date":1430828269476,"type":"CPU","value":42,"description":"complex network"}];

				d.resolve();
				return d.promise;
			}

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

