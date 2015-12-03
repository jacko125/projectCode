L.Map = L.Map.extend({
    openPopup: function (popup, latlng, options) { 
        if (!(popup instanceof L.Popup)) {
            var content = popup;

            popup = new L.Popup(options).setContent(content);
        }

        if (latlng) {
            popup.setLatLng(latlng);
        }

        if (this.hasLayer(popup)) {
            return this;
        }

        // NOTE THIS LINE : COMMENTING OUT THE CLOSEPOPUP CALL
        //this.closePopup(); 
        this._popup = popup;
        return this.addLayer(popup);        
    }
});

miaApp.registerCtrl('mapController', ['$rootScope', function($rootScope) { 
        var self = this;        
                        
        var defaultLocation = { building: '1 MARTIN PLACE', level: 'L 1' };
        self.currentLocation = ($rootScope.user) ? getUserLocation($rootScope.user) : defaultLocation;           
                
        // TODO When logged in, set allLocations
                
        self.allLocations = getAllLocations(self.currentLocation); // Get all locations (including the user's)        
                                
        self.allBuildings = []; // Get all buildings
        for (var i = 0; i < self.allLocations.length; i++) 
            self.allBuildings.push(self.allLocations[i].building);
                
        self.allLevels = getBuildingLevels(self.currentLocation.building, self.allLocations);  // Get levels of the current building                      
        
        self.changeBuilding = function () {                  
            self.allLevels = getBuildingLevels(self.currentLocation.building, self.allLocations);            
            self.currentLocation.level = self.allLevels[0];
            self.changeLevel();
        }        
        
        // TODO When logged out, reset allLocations                
                
        var southWest = L.latLng(-500, -250),
            northEast = L.latLng(500, 250),
            bounds = L.latLngBounds(southWest, northEast);

        var map = new L.map('map').setView([50, -50], 1);        
        var tileLayer = L.tileLayer('http://localhost:3000/maps/1_MARTIN_PLACE_L_1/{z}/{x}/{y}.png',
        {                                       
            maxZoom: 3,
            minZoom: 1,
            continuousWorld: false,        
            noWrap: true,                    
        }).addTo(map);                                
        map.setMaxBounds(bounds);
        
        L.marker(L.latLng(0,0)).addTo(map);

        map.on('click', function(e) {
            console.log(e.latlng);
            console.log(e);
            L.marker(e.latlng).addTo(map);
        });        
        
        self.changeLevel = function () { // Change floor map when level is changed
            var locationFolder = self.currentLocation.building + ' ' + self.currentLocation.level;
            locationFolder = locationFolder.replace(/\s/g, '_');            
            tileLayer.setUrl('http://localhost:3000/maps/' + locationFolder + '/{z}/{x}/{y}.png');
            
            //TODO Change markers
        }
        
        //Get current position
        navigator.geolocation.getCurrentPosition(
                function(pos) {
                    console.log('get current position');
                    console.log(pos);
                    //L.marker([pos.coords.latitude, pos.coords.longitude]).addTo(map);
                },
                function(err) {
                    console.log(err);
                }
        );

}]);   

function getAllLocations(userLocation) {
    var allLocations = [ 
        { building: '1 MARTIN PLACE', levels:['L 1','L 2','L 3'] } 
    ];
    
    var locationExists = false;    
    for (var i = 0; i < allLocations.length; i++) {                                
        if (allLocations[i].building == userLocation.building) {            
            for (var j = 0; j < allLocations[i].levels.length; j++) {                
                if (allLocations[i].levels[j] == userLocation.level) {
                    locationExists = true;
                    break;
                }
            }
        }
    }   

    if (!locationExists)
        allLocations.push({ building: userLocation.building, levels: [userLocation.level]});        
    
    return allLocations;
}

// Get user's location from Macnet profile "postalAddress"
function getUserLocation(user) {    
    // Handle NON-MACQUARIE BUILDING    
    var regex = /(L\s\d)\s(.*)/
    var locFields = user.postalAddress.match(regex);
    console.log('Building: ' + locFields[2] + ' Floor: ' + locFields[1]);    
    return {
        building: locFields[2],
        level: locFields[1]
    };
    
}

// Get levels for a given building
function getBuildingLevels(currentBuilding, allLocations) {
    for (var i = 0; i < allLocations.length; i++) 
        if (allLocations[i].building == currentBuilding)
            return allLocations[i].levels;        
    return [];
}

