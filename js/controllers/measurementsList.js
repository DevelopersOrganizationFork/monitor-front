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
			var types = ['CPU', 'MEMORY', 'NETWORKUP', 'NETWORKDOWN'];
			var i=0, j=0;
			var interval = setInterval(function() {
				
				queries.push(doQuery(sensorsResult[i].id, types[j]));
				j++;
				if(j == 4) {
					j=0;
					i++;
				}
				if(i === sensorsResult.length) {
					clearInterval(interval);
					
					$q.all(queries)
					.then(function(data) {
						
						measurements = [];
						for(i = 0; i < data.length; i++) {
							if(data[i] == null) {
								continue;
							}
							for(j = 0; j < data[i].length; j++) {
								data[i][j].sensor = sensorsResult[Math.floor(i/4)].id;
								measurements.push(data[i][j]);
							}
						}
						onDataFetchSuccess();
						
					});
				}
			}
			, 1000);
			
           
        }
		
		function doQuery(arg, typ) {
			var d = $q.defer();
			var data;
			data = MeasurementsList.query({id:arg, type:typ}, function (data) {
				d.resolve(data);
			}, function() {
				d.resolve(null);
			});
			return d.promise;
		}
    }
]);