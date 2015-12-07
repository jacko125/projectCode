miaApp.controller('searchController', [
    '$scope', '$rootScope', 
    'ngToast','staffSearchService','wsService', 
    function($scope, $rootScope, ngToast, staffSearchService, wsService) {
        var self = this;        
                    
        self.pages = [
            { name: 'list', template: 'view/search/list.html' },
            { name: 'profile', template: 'view/search/profile.html' }
        ];        
        self.selectedPage = self.pages[0];           
        self.pageButtonClick = function(clickedPageName) {
            self.pages.forEach(function(page) {
                if (page.name == clickedPageName) {
                    self.selectedPage = page;
                }                    
            });            
        };
        
        self.searchParams = {
            name: ''
        };       
        self.results = {};               
        self.loadStaffList = function() {           
            staffSearchService.getStaffList(self.searchParams).then(function(results) {
                self.results = results.data.d;
            });
        };

        self.profile = {};
        self.staffButtonClick = function(employeeId) {                       
            self.results.forEach(function(staff) {                
                if (staff.EmployeeId == employeeId)
                    self.profile = staff;
            });            
            self.pageButtonClick('profile');                        
        }
        
        self.requestLocationButtonClick = function(recipient) {
            var toastMsg = 'You have requested ' + self.profile.Description + '\'s location';
            ngToast.create({
                className: 'info',
                animation: 'fade',
                content: '<div class="toast">' + toastMsg + '</div>',
                horizontalPosition: 'left'
            });
            wsService.requestLocation($rootScope.user.Shortname, recipient);            
        }
    }]);
