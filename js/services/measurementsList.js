angular.module('services').factory('MeasurementsList', ['$resource', 'config', function ($resource, config) {
    return $resource(config.sensorsFakeUrl +'/:id/measurements/', {id: '@id'}, {
        query: {
            method: 'GET',
            isArray: true
        }
    })
}]);