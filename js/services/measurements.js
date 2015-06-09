angular.module('services').factory('Measurements', ['$resource', 'config', function ($resource, config) {
    return $resource(config.sensorsFakeUrl +'/:id/measurements/:type', {id: '@id', type: '@type'}, {
        query: {
            method: 'GET',
            isArray: true
        }
    })
}]);