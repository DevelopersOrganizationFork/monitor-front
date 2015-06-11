angular.module('services').factory('Measurements', ['$resource', 'config', function ($resource, config) {
    return $resource(config.sensorsUrl +'/:id/measurements/:type?lastCount=100', {id: '@id', type: '@type'}, {
        query: {
            method: 'GET',
            isArray: true
        }
    })
}]);