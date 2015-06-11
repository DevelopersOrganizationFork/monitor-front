angular.module('controllers').controller('measTypeController', [
		'$scope', '$timeout', '$q', 'Measurements', '$routeParams', '$filter', 'Sensor',
		function ($scope, $timeout, $q, Measurements, $routeParams, $filter, Sensor) {
			$scope.activeTab = 'measurement';
			var measurements;
			var typeOfMeas = $scope.typeOfMeas = $routeParams.name;
			
			function onDataFetchSuccess(sensors) {
				var labels = [], data = [], series = [];
				var i=0;
				var now = new Date().getTime();
				var min = now, max=0;
				measurements.forEach(function(meas) {
					labels[i] = [];
					data[i] = [];
					
					meas.forEach(function(measurement) {
						if(measurement.date < min) {
							min = measurement.date;
						}
						if(measurement.date > max) {
							max = measurement.date;
						}
						labels[i].push(formatDate(new Date(measurement.date)));
						data[i].push(measurement.value);
					});
					series[i] = 'Sensor ' + sensors[i].id;
					i++;
				});
				var maxLength = 0;
				for(var i=0; i<labels.length;i++) {
					if(maxLength < labels[i].length) {
						maxLength = labels[i].length;
					}
				}
				var diff = max - min;
				labels[i] = formatDate(new Date(min));
				for(var i=1; i<maxLength;i++) {
					labels[i] =formatDate(new Date(Math.floor(min + diff/i)));
				}
				$scope.series = series;
				$scope.labels = labels;
				$scope.data = data;
			}
			
			function getSensorsLength() {
				var d = $q.defer();
				var sensors;
				sensors = Sensor.query(function (data) {
					d.resolve(data);
				});
				
				return d.promise;
			}	
			
			
			getSensorsLength().then(function(sensors) {
				var queries = [];
				var i=0, j=0;

				var interval = setInterval(function() {
					
					queries.push(doQuery(sensors[i].id, typeOfMeas));
					i++;
					
					if(i === sensors.length) {
						clearInterval(interval);
						
						$q.all(queries).then(function(data) {

							measurements = data;
							onDataFetchSuccess(sensors);

						});
					}
							
				}, 1500);
			});
				

			function doQuery(number, typeOfMeas) {
				var d = $q.defer();
				Measurements.query({id: number, type: typeOfMeas}, function (data) {
				    d.resolve(data);
				}, function() {
					d.resolve([]);
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