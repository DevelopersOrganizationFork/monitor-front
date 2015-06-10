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
		
		$scope.flags = {};
		
		for(var type in measurements) {
			if(measurements.hasOwnProperty(type)) {
				$scope.flags[type] = {
					chartShow: true,
					tableShow: true
				};
			}
		}

		$scope.measurementsTable = [];
		
        function onDataFetchSuccess(type) {
            var tmpLabels = [], tmpData = [],
				measurementDate = '';
			
			measurements[type] = $filter('orderBy')(measurements[type], 'date');
			
            measurements[type].forEach(function(measurement) {
                tmpLabels.push(formatTime(new Date(measurement.date)));
				// Get dd-mm-yyyy for all measurements only if undefined
				if (!measurementDate) {
					measurementDate = formatDate(new Date(measurement.date));
				}
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
			
            series[type] = [type];
            labels[type] = [tmpLabels];
            data[type] = [tmpData];

            $scope.series = series;
            $scope.labels = labels;
            $scope.data = data;
			//$scope.colours = colors[sensorId];

			$scope.measurementDate = measurementDate;
		}

		// Fetching data
		var intervalTime = 5000,
			intervals = {
				cpu: null,
				memory: null,
				networkup: null,
				networkdown: null
			};

		fetchCpu();
		intervals.cpu = setInterval(fetchCpu, intervalTime);

		fetchMemory();
		intervals.memory = setInterval(fetchMemory, intervalTime);

		fetchNetworkUp();
		intervals.networkup = setInterval(fetchNetworkUp, intervalTime);

		fetchNetworkDown();
		intervals.networkdown = setInterval(fetchNetworkDown, intervalTime);

		function fetchCpu() {
			fetchMeasurementsData('CPU')
			.then(function() {
				$timeout(function () {
					onDataFetchSuccess('CPU');
				}, 0);
			});
		}

		function fetchMemory() {
			fetchMeasurementsData('MEMORY')
			.then(function() {
				$timeout(function () {
					onDataFetchSuccess('MEMORY');
				}, 0);
			});
		}

		function fetchNetworkUp() {
			fetchMeasurementsData('NETWORKUP')
			.then(function() {
				$timeout(function () {
					onDataFetchSuccess('NETWORKUP');
				}, 0);
			});
		}
		function fetchNetworkDown() {
			fetchMeasurementsData('NETWORKDOWN')
				.then(function() {
					$timeout(function () {
						onDataFetchSuccess('NETWORKDOWN');
					}, 0);
				});
		}

        function fetchMeasurementsData(type) {
            var d = $q.defer();
            Measurements.query({id: sensorId, type: type}, function (data) {
                measurements[type] = data;
                d.resolve();
			}, function() {
				console.log('Fetch error: ' + type);
			});
            return d.promise;
        }
		// ***************************

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
        };

		// Stop pooling data - clear all intervals
		$scope.$on("$destroy", function(){
			clearInterval(intervals.cpu);
			clearInterval(intervals.memory);
			clearInterval(intervals.networkup);
			clearInterval(intervals.networkdown);
		});

		function formatDate(date) {
			var day = date.getDay(),
				month = date.getMonth()+1,
				year = date.getFullYear();

			day = day < 10 ? '0'+ day : day;
			month = month < 10 ? '0'+ month : month;
			return day + '-' + month + '-' + year;
		}
		
		function formatTime(date) {
			
            var hours = date.getHours(),
				minutes = date.getMinutes(),
				seconds = date.getSeconds();

			hours = hours < 10 ? '0'+ hours : hours;
            minutes = minutes < 10 ? '0'+ minutes : minutes;
            seconds = seconds < 10 ? '0'+ seconds : seconds;
            return hours +':'+ minutes +':'+ seconds;
        }
    }
]);

