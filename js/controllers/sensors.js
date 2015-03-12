angular.module('controllers').controller('sensorsController', [
    '$scope', '$timeout', '$q', 'Sensor',
    function($scope, $timeout, $q, Sensor) {
        var sensors;

        function onDataFetchSuccess() {
            $scope.sensors = sensors;
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
                }
            ];
            d.resolve();
            return d.promise;
        }
    }
]);