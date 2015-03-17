angular.module('controllers').controller('sensorsController', [
    '$scope', '$timeout', '$q', 'Sensor','ngTableParams', '$filter',
    function($scope, $timeout, $q, Sensor,ngTableParams, $filter) {
        $scope.activeTab='sensors';
		var sensors;

        function onDataFetchSuccess() {
            $scope.sensors = sensors;
			
			$scope.sensorTable = new ngTableParams({
				page: 1,            // show first page
				count: 10,          // count per page
				filter: {},
				sorting: {
					id: 'asc'     // initial sorting
				}
				}, {
				total: sensors.length, // length of sensors
				getData: function($defer, params) {
					// use build-in angular filter
					var filteredData = params.filter() ?
                    $filter('filter')(sensors, params.filter()) :
                    sensors;
					var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    sensors;
					
					params.total(orderedData.length); // set total for recalc pagination
					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
			});
        }

        getSensorsData()
            .then(function() {
                $timeout(function () {
                    onDataFetchSuccess();
                }, 0);
            });

        function getSensorsData() {
            var d = $q.defer();
            //Sensor.query(function (data) {
            //    sensors = data;
            //    d.resolve();
            //});

            // mock data
            sensors = [
                {
                    id: 0,
                    cpuUsage: 10,
                    ramUsage: 2100
                },
                {
                    id: 1,
                    cpuUsage: 89,
                    ramUsage: 5500
                },
				{
					id: 2,
					cpuUsage: 65,
					ramUsage: 2900
				}
            ];
            d.resolve();
            return d.promise;
        }
    }
]);