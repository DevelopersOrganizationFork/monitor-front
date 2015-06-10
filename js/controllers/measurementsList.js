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

		getSensorsLength().then(function(sensorsResult) {
			getMeasurementsData(sensorsResult);
		});
            
		function getSensorsLength() {
			var d = $q.defer();
            var sensorsResult;
			sensorsResult = Sensor.query(function (data) {
                d.resolve(sensorsResult);
            });
			
            return d.promise;
		}	

        function getMeasurementsData(sensorsResult) {
			
			var queries = [];
			var i, j;
			for(i = 0; i < sensorsResult.length; i++) {
				queries.push(doQuery(sensorsResult[i].id));
			}
			
            $q.all(queries)
			.then(function(data) {
                $timeout(function () {
					measurements = [];
					for(i = 0; i < sensorsResult.length; i++) {
						for(j = 0; j < sensorsResult[i].length; j++) {
							sensorsResult[i][j].sensor = i;
							measurements.push(sensorsResult[i][j]);
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