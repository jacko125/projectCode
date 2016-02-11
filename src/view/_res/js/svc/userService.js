miaApp.factory('userService', ['$http', function($http) {
    var self = this;    

    var profile = {}; // Used for caching staff results between profile pages.
    
    self.staffSearchUrl = config.searchUrl;    

    var getStaffList = function(staffSearchParams) {
        var params = {
            'callback': 'JSON_CALLBACK',
            'name': staffSearchParams.name
        };

        return $http.jsonp(self.staffSearchUrl + '/FindADProfileByName', {
            'params': params
        });
    };  

    return {               
        getStaffList: getStaffList,
        
    };
}])
