(function() {
    'use strict';
    var service = angular.module('mia');
    service.factory('errorService',['errorDefinitions',
        function(errorDefinitions) {

            var getErrorMessageByCode = function(code) {
                if(angular.isDefined(errorDefinitions.errors[code]) && angular.isDefined(errorDefinitions.errors[code].message) && errorDefinitions.errors[code].message) {
                    return errorDefinitions.errors[code].message;
                }
                return errorDefinitions.errors['unexpected.notMapped'].message;
            };

            var getErrorTooltipByCode = function(code) {
                if(angular.isDefined(errorDefinitions.errors[code]) && angular.isDefined(errorDefinitions.errors[code].tooltip) && errorDefinitions.errors[code].tooltip) {
                    return errorDefinitions.errors[code].tooltip;
                }
                return errorDefinitions.errors['unexpected.notMapped'].tooltip;
            };


            return {
                getErrorMessageByCode: getErrorMessageByCode,
                getErrorTooltipByCode: getErrorTooltipByCode
            };
        }]);
}());
