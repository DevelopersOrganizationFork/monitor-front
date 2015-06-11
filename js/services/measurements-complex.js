angular.module('services').factory('MeasurementsComplex', ['$resource', 'config', function ($resource, config) {
    return $resource(config.sensorsUrl +'/:id/measurements/', {id: '@id'}, {
        query: {
            method: 'GET',
            isArray: true
        }
    })
}]);