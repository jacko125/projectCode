(function() {
    'use strict';
    var service = angular.module('mia');
    service.factory('errorDefinitions',
        function() {
            var errors = {
                'unexpected.notMapped': {
                    'message': 'An unexpected error has occurred',
                    'tooltip': ''
                },
                'loginError': {
                    'message': 'User login details not found. Please try again.',
                    'tooltip': 'Tip: Log in with your staff username.'
                },
                'staffSearchError': {
                    'message': 'Unable to contact the Staff Search service.',
                    'tooltip': ''                    
                },
                'httpError': {
                    'message': 'Unable to contact the MIA HTTP server',
                    'tooltip': ''
                },
                'websocketError': {
                    'message': 'Unable to contact the MIA Websocket server',
                    'tooltip': ''
                }                
            };
            return {
                errors: errors
            };
        });
}());
