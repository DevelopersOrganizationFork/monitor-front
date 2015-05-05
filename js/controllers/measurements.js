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
				Measurement.query({type: 'CPU'}, function (data) {
					cpuData = data;
				    d.resolve();
				});

				return d.promise;
			}

			function getMemoryData() {
				var d = $q.defer();
				Measurement.query({type: 'MEMORY'}, function (data) {
					memoryData = data;
				    d.resolve();
				});

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

