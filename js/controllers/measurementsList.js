angular.module('controllers').controller('measurementsListController', [
    '$scope', '$timeout', '$q', 'MeasurementsList','ngTableParams', '$filter', 'Sensor',
    function($scope, $timeout, $q, MeasurementsList, ngTableParams, $filter, Sensor) {
        $scope.activeTab='measurements';
		var measurements;

        function onDataFetchSuccess() {
            $scope.measurements = measurements;
			
			$scope.measurementsTable = new ngTableParams({
				page: 1,            // show first page
				count: 10,          // count per page
				filter: {},
				sorting: {
					id: 'asc'     // initial sorting
				}
				}, {
				total: measurements.length, // length of measurements
				getData: function($defer, params) {
					// use build-in angular filter
					var filteredData = params.filter() ? $filter('filter')(measurements, params.filter()) : measurements;
					var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : measurements;
					
					params.total(orderedData.length); // set total for recalc pagination
					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
			});
        }

		getSensorsLength().then(function(sensors) {
			getMeasurementsData(sensors.length);
		});
            
		function getSensorsLength() {
			var d = $q.defer();
            var sensors;
			sensors = Sensor.query(function (data) {
                d.resolve(sensors);
            });
			
            return d.promise;
		}	

        function getMeasurementsData(sensorsLength) {
			
			var queries = [];
			var i, j;
			for(i = 0; i < sensorsLength; i++) {
				queries.push(doQuery(''+i));
			}
			
            $q.all(queries)
			.then(function(data) {
                $timeout(function () {
					measurements = [];
					for(i = 0; i < sensorsLength; i++) {
						for(j = 0; j < data[i].length; j++) {
							data[i][j].sensor = i;
							measurements.push(data[i][j]);
						}
					}
                    onDataFetchSuccess();
                }, 0);
            });
        }
		
		function doQuery(arg) {
			var d = $q.defer();
            var result = MeasurementsList.query({id:arg}, function (data) {
                d.resolve(result);
            });
            return d.promise;
		}
    }
]);