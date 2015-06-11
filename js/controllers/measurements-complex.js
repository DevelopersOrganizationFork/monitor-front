angular.module('controllers').controller('measurementsComplexController', [
    '$scope', '$timeout', '$q', 'Sensor', 'MeasurementsComplex',
    function ($scope, $timeout, $q, Sensor, MeasurementsComplex) {
        $scope.activeTab = 'measurementsComplex';
		var sensors;

		var measurement = {
			timeRange: 10,
			interval: 5,
			timeUnit: 'SECOND',
			type: 'CPU',
			sensor: null,
			name: ''
		};

		function onDataFetchSuccess() {
			sensors = sensors.map(function(sensor) {
				return sensor.id;
			});
			$scope.sensors = sensors;

			if (sensors.length) {
				measurement.sensor = sensors[0];
			}

			$scope.measurement = angular.copy(measurement);

			$scope.submit = function() {
				$scope.measurementSend = true;
				$timeout(function () {
					$scope.measurementSend = false;
				}, 3000);

				saveComplexMeasurement($scope.measurement);
			};
		}

		getSensorsData()
			.then(function() {
				$timeout(function () {
					onDataFetchSuccess();
				}, 0);
			});

		function getSensorsData() {
			var d = $q.defer();
			Sensor.query(function (data) {
				sensors = data;
				d.resolve();
			});

			return d.promise;
		}

		function saveComplexMeasurement(measurementPayload) {
			var d = $q.defer();
			MeasurementsComplex.save({id: measurementPayload.sensor}, measurementPayload, function (data) {
				console.log(data);
				$scope.measurementAdded = true;
				$scope.measurement = measurement;
				d.resolve();
			});

			return d.promise;
		}
    }
]);
