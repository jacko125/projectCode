miaApp.registerCtrl('searchController', ['$scope', '$rootScope', 'staffSearchService','wsService', 
    function($scope, $rootScope, staffSearchService, wsService) {
        var self = this;        
                    
        self.pages = [
            { name: 'list', template: 'view/search/list.html' },
            { name: 'profile', template: 'view/search/profile.html' }
        ];
        
        self.selectedPage = self.pages[0];
            
        self.pageButtonClick = function(clickedPage) {                
            for (var i = 0; i < self.pages.length; i++) {                    
                if (self.pages[i].name == clickedPage)
                    self.selectedPage = self.pages[i];            
            }        
        }
        
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
        self.staffButtonClick = function(employeeID) {
            self.profile = {};
            self.selectedProfile = staffSearchService.getStaffProfile(employeeID).then(function(results) {
                console.log(results);
                self.profile = results.data.d[0];                
            });
            self.pageButtonClick('profile');                        
        }
        
        self.requestLocationButtonClick = function(recipient) {
            console.log('request button clicked');
            wsService.requestLocation($rootScope.user.Shortname, recipient);            
        }
    }]);
