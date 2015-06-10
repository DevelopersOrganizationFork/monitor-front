angular.module('controllers').controller('measTypeController', [
		'$scope', '$timeout', '$q', 'Measurements', '$routeParams', '$filter', 'Sensor',
		function ($scope, $timeout, $q, Measurements, $routeParams, $filter, Sensor) {
			$scope.activeTab = 'measurement';
			var measurements;
			var typeOfMeas = $scope.typeOfMeas = $routeParams.name;

			function onDataFetchSuccess() {
				var labels = [], data = [], series = [];
				var i=0;
				measurements.forEach(function(sensors) {
					labels[i] = [];
					data[i] = [];
					sensors.forEach(function(measurement) {
						labels[i].push(formatDate(new Date(measurement.date)));
						data[i].push(measurement.value);
					});
					series[i] = 'Sensor ' + i;
					i++;
				});
				$scope.series = series;
				$scope.labels = labels[0];
				$scope.data = data;
			}
			
			function getSensorsLength() {
				var d = $q.defer();
				var sensors;
				sensors = Sensor.query(function (data) {
					d.resolve(sensors);
				});
				
				return d.promise;
			}	
			
			
			getSensorsLength().then(function(sensors) {
				var queries = [];
				var i, j;
				for(i = 0; i < sensors.length; i++) {
					queries.push(doQuery(''+i, typeOfMeas));
				}
				
				$q.all(queries).then(function(data) {
					$timeout(function () {
						measurements = data;
						onDataFetchSuccess();
					}, 0);
				});

			});
				

			function doQuery(number, typeOfMeas) {
				var d = $q.defer();
				var result = Measurements.query({id: number, type: typeOfMeas}, function (data) {
				    d.resolve(result);
				});

				return d.promise;
			}

			function formatDate(date) {
				var hours = date.getHours(),
					minutes = date.getMinutes(),
					seconds = date.getSeconds(),
					mss = date.getMilliseconds();
				minutes = minutes < 10 ? '0'+ minutes : minutes;
				mss = mss < 100 ? '0'+ mss : mss;
				mss = mss < 10 ? '0'+ mss : mss;
				return hours +':'+ minutes +':'+ mss;
			}
		}
	]);