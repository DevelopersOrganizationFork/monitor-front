angular.module('services').factory('Sensor', ['$resource', 'config', function ($resource, config) {
    return $resource(config.sensorsUrl + '/:id', {id: '@id'}, {
        query: {
            method: 'GET',
            isArray: true
        }
    })
}]);