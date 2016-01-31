miaApp.controller('mapController', [
    '$rootScope', '$scope', '$state', '$stateParams', '$location',
    'ngToast', 'requestService', 'wsService',
    function(                  
        $rootScope, $scope, $state, $stateParams,
        $location, ngToast, requestService, wsService) { 
        
        var self = this;
        
        // Loaded from server on parent.html
        self.mapViewData = mapViewData; 
        self.mapItemData = mapItemData;                
        
        // stateParams actions: "send-response","view-response"               
        $scope.action = $stateParams.action; // Action being taken
        $scope.target = $stateParams.target; // Recipient of action
                                
        var defaultLocation = { building: '1 MARTIN PLACE', level: 'L 1' };
        self.currentLocation = ($rootScope.user) ? getUserLocation($rootScope.user) : defaultLocation;                                           
 
        self.allLocations = [];
        self.allLocations = self.allLocations.concat(self.mapViewData);                        
        self.allLocations.shift(); // Remove default map from list        
                
        self.unsupportedMap = (getMapViewData(self.allLocations, self.currentLocation) == null)
        
        self.allBuildings = []; // Get all buildings
        for (var i = 0; i < self.allLocations.length; i++) 
            self.allBuildings.push(self.allLocations[i].building);                
        self.allLevels = getBuildingLevels(self.currentLocation.building, self.allLocations);  // Get levels of the current building                      
                
        self.changeBuilding = function (building) { 
            self.currentLocation.building = building;
            self.allLevels = getBuildingLevels(self.currentLocation.building, self.allLocations);  // Get levels of the current building                      
            self.currentLocation.level = self.allLevels[0]; // Defaults floor to first level                        
            self.updateMap(); // Based in mapFunctions            
        }
        self.changeLevel = function(level) {
            self.currentLocation.level = level;            
            self.updateMap();            
        }               
        
        var userMarker = L.marker(L.latLng(0,0), { draggable: ($scope.action !== 'view-response') });               
        mapFunctions(self, {
            $location: $location,
            $stateParams: $stateParams,
            userMarker: userMarker
        });        
        self.updateMap() // Refreshes map
        
        // Assume response location is valid (and maps exist)
        if ($stateParams.action === 'view-response') {            
            var response = $stateParams.target;                    
            self.currentLocation = response.data.location;                     
            self.updateMap();
            userMarker.setLatLng(L.latLng(response.data.location.latLng.lat, response.data.location.latLng.lng));                                                            
        }
             
        requestFunctions(self, {            
            $scope: $scope,     
            $rootScope: $rootScope,
            wsService: wsService,
            userMarker: userMarker
        });        
}]);   

function mapFunctions(self, dep) {
    
    var map = L.map('map');
    var tileLayer = L.tileLayer("").addTo(map);
         
    self.updateMap = function () { // Change floor map when level is changed        
        var viewData = getMapViewData(self.mapViewData, self.currentLocation);                                       
        
        self.unsupportedMap = (viewData == null);
        if (self.unsupportedMap) {                        
            viewData = getMapViewData(self.mapViewData, { building: "default", level: "default" });                                   
            console.log("unsupported");
        }       
        console.log("supported");
        
        map.setView([viewData.origin.latLng[0], viewData.origin.latLng[1]], viewData.origin.zoom)                                                         
        var southWest = L.latLng(viewData.bounds.SW[0], viewData.bounds.SW[1]),
            northEast = L.latLng(viewData.bounds.NE[0], viewData.bounds.NE[1]),
            bounds = L.latLngBounds(southWest, northEast);
        map.setMaxBounds(bounds);   
       
        map.removeLayer(tileLayer);
        var url = 'http://' + dep.$location.host() 
                    + ':' + dep.$location.port() 
                    + '/maps/' + getLocationFolder(self.currentLocation) 
                    + '/{z}/{x}/{y}.png';
        
        tileLayer = L.tileLayer(url, {
            maxZoom: viewData.zoom.max,
            minZoom: viewData.zoom.min,
            continuousWorld: false,
            noWrap: true
        }).addTo(map);
                        
        if (dep.$stateParams.action == 'view-response' 
            || dep.$stateParams.action == 'send-response') {                
            dep.userMarker.addTo(map);                                       
        } else {
            map.removeLayer(dep.userMarker);   
        }
        
        var itemData = getMapItemData(self.mapItemData.data, self.currentLocation);        
                        
        //TODO Change markers
    }
    
    self.updateMap();
        
    map.on('click', function(e) {            
        console.log(e.latlng);        
        if (dep.$stateParams.action == 'send-response') {                       
            dep.userMarker.setLatLng(e.latlng);
            dep.userMarker.addTo(map);            
        }                              
    });
    
    self.isMapSupportedClass = function() {
        return {
            'map-disabled': self.unsupportedMap
        }
    }
    
    //Get current position (Only for mobile devices)
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
}

function requestFunctions(self, dep) {

    self.sendLocationButtonClick = function(request) {
        dep.wsService.sendResponse(dep.$rootScope.user, request, {
            building: self.currentLocation.building,
            level: self.currentLocation.level,
            latLng: dep.userMarker.getLatLng()
        }); // Parent is notified as observer from wsService (for toast)        
    }
    
}

// Get user's location from Macnet profile "postalAddress"
function getUserLocation(user) {    
    // TODO: Handle NON-MACQUARIE BUILDING    
    var regex = /(L\s\d)\s(.*)/
    var locFields = user.postalAddress.match(regex);
    console.log('Building: ' + locFields[2] + ' Level: ' + locFields[1]);    
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

function getLocationFolder(currentLocation) {
    var locationFolder = currentLocation.building + ' ' + currentLocation.level;
    return locationFolder.replace(/\s/g, '_');           
}

function getMapViewData(allViewData, currentLocation) {
    var result = null;
    allViewData.forEach(function(location) {        
        if (location.building == currentLocation.building) {
            location.levels.forEach(function(level) {                 
                if (level == currentLocation.level) {
                    result = location;                    
                    return;
                }
            });
        }        
    });        
    return result;
}

function getMapItemData(allItemData, currentLocation) {
    var result = null;
    allItemData.forEach(function(location) {
        if (location.building == currentLocation.building) {            
            location.levels.forEach(function(level) {
                if (level.name == currentLocation.level) {                           
                    result = level;
                    return;
                }
            });
        }
    });
    return result;    
}

function createMeetingRoomIcon() {
    return L.icon({
        iconUrl: '/img/map-icons/meeting.png',        
        iconSize:     [45, 45], // size of the icon        
        iconAnchor:   [22.5, 22.5], // point of the icon which will correspond to marker's location        
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });
}

function createLiftIcon() {
    return L.icon({
        iconUrl: '/img/map-icons/lift.png',        
        iconSize:     [45, 45], // size of the icon        
        iconAnchor:   [22.5, 22.5], // point of the icon which will correspond to marker's location        
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });    
}
