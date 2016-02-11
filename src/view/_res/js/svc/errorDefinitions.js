(function() {
    'use strict';
    var service = angular.module('mia');
    service.factory('errorDefinitions',
        function() {
            var errors = {
                'unexpected.notMapped': {
                    'message': 'An unexpected error has occurred. Please try again.',
                    'tooltip': ''
                },
                'loginError': {
                    'message': 'User login details not found. Please try again.',
                    'tooltip': 'Tip: Login with your staff username.'
                }
            };
            return {
                errors: errors
            };
        });
}());
