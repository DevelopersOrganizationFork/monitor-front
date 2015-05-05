angular.module('services').factory('Measurement', ['$resource', 'config', function ($resource, config) {
    return $resource(config.apiUrl +'measurements/:type', {type: '@type'}, {
        query: {
            method: 'GET',
            isArray: true
        }
    })
}]);