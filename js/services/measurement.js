angular.module('services').factory('Measurement', ['$resource', 'config', function ($resource, config) {
    return $resource(config.sensorsFakeUrl +'/:id/measurements/:type', {id: '@id', type: '@type'}, {
        query: {
            method: 'GET',
            isArray: true
        }
    })
}]);