angular.module('controllers').controller('measurementsController', [
		'$scope', '$timeout', '$q', 'Measurement',
		function ($scope, $timeout, $q, Measurement) {
			$scope.activeTab = 'measurements';
			var cpuData, memoryData;

			function onDataFetchSuccess() {
				var labels = [], data = [];
				cpuData.forEach(function(measurement) {
					labels.push(formatDate(new Date(measurement.date)));
					data.push(measurement.value);
				});
				$scope.cpuSeries = ['Cpu (%)'];
				$scope.cpuLabels = labels;
				$scope.cpuData = [data];

				labels = []; data = [];

				memoryData.forEach(function(measurement) {
					labels.push(formatDate(new Date(measurement.date)));
					data.push(measurement.value);
				});
				$scope.memorySeries = ['Memory (MB)'];
				$scope.memoryLabels = labels;
				$scope.memoryData = [data];
			}

			getCpuData()
				.then(getMemoryData)
				.then(function() {
					$timeout(function () {
						onDataFetchSuccess();
					}, 0);
				});

			function getCpuData() {
				var d = $q.defer();
				//Measurement.query({type: 'CPU'}, function (data) {
				//	measurements = data;
				//    d.resolve();
				//});

				// MOCK MOCK
				cpuData = [{"date":1430828269469,"type":"CPU","value":52},
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

			function getMemoryData() {
				var d = $q.defer();
				//Measurement.query({type: 'MEMORY'}, function (data) {
				//	memoryData = data;
				//    d.resolve();
				//});

				// MOCK MOCK
				memoryData = [{"date":1430828269477,"type":"MEMORY","value":81},
					{"date":1430828269477,"type":"MEMORY","value":18},
					{"date":1430828269478,"type":"MEMORY","value":13},
					{"date":1430828269479,"type":"MEMORY","value":23},
					{"date":1430828269480,"type":"MEMORY","value":18},
					{"date":1430828269480,"type":"MEMORY","value":61},
					{"date":1430828269481,"type":"MEMORY","value":78,"description":"complex memory"},
					{"date":1430828269482,"type":"MEMORY","value":95,"description":"complex cpu"},
					{"date":1430828269483,"type":"MEMORY","value":51,"description":"complex network"}];

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

