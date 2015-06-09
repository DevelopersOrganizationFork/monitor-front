angular.module('controllers').controller('measurementsController', [
    '$scope', '$timeout', '$q', 'Measurements', '$routeParams',
    function ($scope, $timeout, $q, Measurements, $routeParams) {
        $scope.activeTab = 'measurement';
        var measurements = {
            cpu: null,
            memory: null,
            networkup: null,
            networkdown: null
        };
        var series = {}, labels = {}, data = {};
        var sensorId = $routeParams.name.slice(-1); // temporary solution for getting sensor ID
        $scope.sensorId = sensorId;

        function onDataFetchSuccess(type) {
            var tmpLabels = [], tmpData = [];
            measurements[type].forEach(function(measurement) {
                tmpLabels.push(formatDate(new Date(measurement.date)));
                tmpData.push(measurement.value);
            });
            series[type] = ['Sensor ' + sensorId + ': ' + type];
            labels[type] = tmpLabels;
            data[type] = [tmpData];

            $scope.series = series;
            $scope.labels = labels;
            $scope.data = data;
        }

        // Fetch measurements data
        fetchMeasurementsData('CPU')
            .then(function() {
                $timeout(function () {
                    onDataFetchSuccess('CPU');
                }, 0);
            });

        fetchMeasurementsData('MEMORY')
            .then(function() {
                $timeout(function () {
                    onDataFetchSuccess('MEMORY');
                }, 0);
            });

        fetchMeasurementsData('NETWORKUP')
            .then(function() {
                $timeout(function () {
                    onDataFetchSuccess('NETWORKUP');
                }, 0);
            });

        fetchMeasurementsData('NETWORKDOWN')
            .then(function() {
                $timeout(function () {
                    onDataFetchSuccess('NETWORKDOWN');
                }, 0);
            });
        // ***************************

        function fetchMeasurementsData(type) {
            var d = $q.defer();
            Measurements.query({id: sensorId, type: type}, function (data) {
                measurements[type] = data;
                d.resolve();
            });

            return d.promise;
        }

        function formatDate(date) {
            var hours = date.getHours(),
                minutes = date.getMinutes(),
                seconds = date.getSeconds(),
                mss = date.getMilliseconds();
            minutes = minutes < 10 ? '0'+ minutes : minutes;
            seconds = seconds < 10 ? '0'+ seconds : seconds;
            mss = mss < 100 ? '0'+ mss : mss;
            mss = mss < 10 ? '0'+ mss : mss;
            return hours +':'+ minutes +':'+ seconds +':'+ mss;
        }
    }
]);

