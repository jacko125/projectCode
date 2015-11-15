miaApp.registerCtrl('exampleController', [function() { 
    var self = this;        
    
    self.title = 'Example';
    self.message = 'This page demonstrates multiple page views';
    
    self.pages = [
        { name: 'page0', template: 'view/example/page0.html' },
        { name: 'page1', template: 'view/example/page1.html' },
        { name: 'page2', template: 'view/example/page2.html' },
        { name: 'page3', template: 'view/example/page3.html' }
    ];
    
    self.selectedPage = self.pages[0];
        
    self.pageButtonClick = function(clickedPage) {                
        for (var i = 0; i < self.pages.length; i++) {                    
            if (self.pages[i].name == clickedPage)
                self.selectedPage = self.pages[i];            
        }        
    }
                
}]);   