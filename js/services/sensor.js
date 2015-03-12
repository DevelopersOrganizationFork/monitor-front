angular.module('services').factory('Sensor', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl +'sensors/:id', {id: '@id'}, {
        query: {
            method: 'GET',
            isArray: true
        }
    })
}]);