miaApp.controller('mapController', [
    '$rootScope', '$scope', '$state', '$stateParams', '$location',
    'ngToast', 'requestService', 'wsService',
    function(                  
        $rootScope, $scope, $state, $stateParams,
        $location, ngToast, requestService, wsService) { 
        
        var self = this;
        
        // stateParams action: "send-response"|"view-response"               
        $scope.action = $stateParams.action;
        $scope.target = $stateParams.target;
                                
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
            self.currentLocation.level = self.allLevels[0]; // Defaults floor to first level
            self.changeLevel(); // Based in mapFunctions
            checkUnsupportedMap(self);            
        }
        
        // TODO When logged out, reset allLocations         
        
        var userMarker = L.marker(L.latLng(0,0), { draggable: ($scope.action !== 'view-response') });               
        mapFunctions(self, {
            $location: $location,
            $stateParams: $stateParams,
            userMarker: userMarker
        });        
        self.changeLevel() // Refreshes map
        
        // Assume response location is valid (and maps exist)
        if ($stateParams.action === 'view-response') {            
            var response = $stateParams.target;                    
            self.currentLocation.building = response.location.building;                        
            self.changeBuilding();            
            self.currentLocation.level = response.location.level;            
            self.changeLevel();
            userMarker.setLatLng(L.latLng(response.location.latLng.lat, response.location.latLng.lng));                                                            
        }
             
        requestFunctions(self, {            
            $scope: $scope,     
            $rootScope: $rootScope,
            wsService: wsService,
            userMarker: userMarker
        });
        
        // self.removeResponseButtonClick = function(response) {
            // console.log('remove response');
            // console.log(response);
            // requestService.removeResponse(requestService, response.sender);
            // wsService.removeResponse(response);
        // }
        
        
}]);   

function mapFunctions(self, dep) {
    
    var southWest = L.latLng(-500, -250),
            northEast = L.latLng(500, 250),
            bounds = L.latLngBounds(southWest, northEast);                   
    var map = new L.map('map').setView([50, -50], 1); // View starts here
        
    var urlBase = 'http://' + dep.$location.host() + ':' + dep.$location.port();
    var locFolder = getLocationFolder(self.currentLocation);
    var tileLayer = L.tileLayer(urlBase + '/maps/' + locFolder + '/{z}/{x}/{y}.png',
    {                                       
        maxZoom: 3,
        minZoom: 1,
        continuousWorld: false,        
        noWrap: true,                    
    }).addTo(map);                                
    map.setMaxBounds(bounds);
        
    dep.userMarker.addTo(map);
    map.on('click', function(e) {            
        console.log(e.latlng);        
        if (dep.$stateParams.action == 'send-response') {                       
            dep.userMarker.setLatLng(e.latlng);
            dep.userMarker.addTo(map);            
        }                              
    });        
    
    self.changeLevel = function () { // Change floor map when level is changed
        tileLayer.setUrl('http://' + dep.$location.host() + ':' + dep.$location.port() + '/maps/' + getLocationFolder(self.currentLocation) + '/{z}/{x}/{y}.png');                        
        checkUnsupportedMap(self);                           
        if (dep.$stateParams.action == 'view-response' || dep.$stateParams.action == 'send-response')
            dep.userMarker.addTo(map);                                       
        else
            map.removeLayer(dep.userMarker);   
            
        //TODO Change markers
    }
    
    self.isMapSupportedClass = function() {
        return {
            'map-disabled': self.unsupportedMap
        }
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
    
    
}

function requestFunctions(self, dep) {

    self.sendLocationButtonClass = function() {
        return {
            'btn': true,
            'btn-success': true,
            'disabled': self.unsupportedMap
        };
    };            
    
    self.sendLocationButtonClick = function(request) {
        dep.wsService.sendResponse(dep.$rootScope.user, request, {
            building: self.currentLocation.building,
            level: self.currentLocation.level,
            latLng: dep.userMarker.getLatLng()
        }); // Parent is notified as observer from wsService (for toast)        
    }
}

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

function getLocationFolder(currentLocation) {
    var locationFolder = currentLocation.building + ' ' + currentLocation.level;
    return locationFolder.replace(/\s/g, '_');           
}

function checkUnsupportedMap(self) {        
    self.unsupportedMap = !(self.currentLocation.building == '1 MARTIN PLACE' && $.inArray(self.currentLocation.level, ['L 1', 'L 2', 'L 3']) >= 0);       
}

