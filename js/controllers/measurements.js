angular.module('controllers').controller('measurementsController', [
    '$scope', '$timeout', '$q', 'Measurements', '$routeParams', 'ngTableParams', '$filter',
    function ($scope, $timeout, $q, Measurements, $routeParams, ngTableParams, $filter) {
        $scope.activeTab = 'measurement';
        var measurements = {
            CPU: null,
            MEMORY: null,
            NETWORKUP: null,
            NETWORKDOWN: null
        };
        var series = {}, labels = {}, data = {};
        var sensorId = $routeParams.name; // temporary solution for getting sensor ID
        $scope.sensorId = sensorId;

		var colors = [['Red'], ['Green']];
		
		$scope.flags = [];
		
		for(type in measurements) {
			if(measurements.hasOwnProperty(type)) {
				$scope.flags[type] = new Object();
				
				$scope.flags[type].chartShow = true;
				$scope.flags[type].tableShow = true;
			}
		}
		
		$scope.measurementsTable = [];
		
        function onDataFetchSuccess(type) {
            var tmpLabels = [], tmpData = [];
			
			measurements[type] = $filter('orderBy')(measurements[type], 'date');
			
            measurements[type].forEach(function(measurement) {
                tmpLabels.push(formatDate(new Date(measurement.date)));
                tmpData.push( parseFloat(measurement.value).toFixed(4));
            });

			$scope.measurementsTable[type] = new ngTableParams({
				page: 1,            // show first page
				count: 10,          // count per page
				filter: {},
				sorting: {
					id: 'asc'     // initial sorting
				}
				}, {
				total: measurements[type].length, // length of measurement
				getData: function($defer, params) {
					// use build-in angular filter
					var filteredData = params.filter() ? $filter('filter')(measurements[type], params.filter()) : measurements[type];
					var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : measurements[type];
					
					params.total(orderedData.length); // set total for recalc pagination
					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
			});
			
            series[type] = ['Sensor ' + sensorId + ': ' + type];
            labels[type] = [tmpLabels];
            data[type] = [tmpData];

            $scope.series = series;
            $scope.labels = labels;
            $scope.data = data;
			//$scope.colours = colors[sensorId];

        }

		function fetchAllData() {
			fetchMeasurementsData('CPU')
			.then(function() {
				$timeout(function () {
					fetchMemory();
					onDataFetchSuccess('CPU');
				}, 0);
			});
		}

		fetchAllData();

		function fetchMemory() {
			fetchMeasurementsData('MEMORY')
			.then(function() {
				$timeout(function () {
					fetchNetUp();
					onDataFetchSuccess('MEMORY');
				}, 0);
			});
		}

		function fetchNetUp() {
			fetchMeasurementsData('NETWORKUP')
			.then(function() {
				$timeout(function () {
					fetchNetDown();
					onDataFetchSuccess('NETWORKUP');
				}, 0);
			});
		}
		function fetchNetDown() {
			fetchMeasurementsData('NETWORKDOWN')
				.then(function() {
					$timeout(function () {
						onDataFetchSuccess('NETWORKDOWN');
						
						fetchAllData();
					}, 0);
				});
		}
        // ***************************

        function fetchMeasurementsData(type) {
            var d = $q.defer();
            Measurements.query({id: sensorId, type: type}, function (data) {
                measurements[type] = data;
                d.resolve();
			}, function() {
				$timeout(function () {
					fetchAllData();
				}, 10000);
			});
            return d.promise;
        }

        $scope.changeAmountOfData = function(nr, type) {
			if($scope.data[type].dateAll) {
				$scope.data[type][0] = $scope.data[type].dateAll[0].slice();
				$scope.labels[type][0] = $scope.labels[type].labelsAll[0].slice();
			} else {
				$scope.data[type].dateAll = $scope.data[type].slice();
				$scope.labels[type].labelsAll = $scope.labels[type].slice();
			}
			
			$scope.data[type][0] = $scope.data[type][0].slice(-nr);
			$scope.labels[type][0] = $scope.labels[type][0].slice(-nr);
        }
		
		function formatDate(date) {
			
            var day = date.getDay(),
				month = date.getMonth()+1,
				year = date.getYear(),
				hours = date.getHours(),
				minutes = date.getMinutes(),
				seconds = date.getSeconds(),
				mss = date.getMilliseconds();
				
            minutes = minutes < 10 ? '0'+ minutes : minutes;
            seconds = seconds < 10 ? '0'+ seconds : seconds;
            mss = mss < 100 ? '0'+ mss : mss;
            mss = mss < 10 ? '0'+ mss : mss;
            return day + '-' + month + '-' + year + ' '+ hours +':'+ minutes +':'+ seconds +':'+ mss;
        }
    }
]);

