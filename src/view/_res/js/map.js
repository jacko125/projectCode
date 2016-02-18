miaApp.controller('mapController', [
    '$rootScope', '$scope', '$state', '$stateParams', '$location',
    'ngToast', 'requestService', 'wsService', 'userService',
    function(                  
        $rootScope, $scope, $state, $stateParams,
        $location, ngToast, requestService, wsService, userService) { 
        
        var self = this;
        
        // Loaded from server on parent.html
        self.mapViewData = mapViewData; 
        self.mapItemData = mapItemData;                
        
        if ($stateParams.link != null) {
            $stateParams.action = 'view-link';
            console.log
            $stateParams.target = getLinkLocation($stateParams.linkLocation);
        }
        else if ($stateParams.action == null) 
            $stateParams.action = 'share-link';                              
                               
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
            self.updateUrlTextbox(self.currentLocation, userMarker.getLatLng());
        }
        self.changeLevel = function(level) {
            self.currentLocation.level = level;            
            self.updateMap();            
            self.updateUrlTextbox(self.currentLocation, userMarker.getLatLng());
        }
                
        self.choosingLocation = function(action) {            
            return (['send-broadcast',
                     'send-broadcast-group',
                     'send-response',
                     'share-link',
                     'set-default-loc'].indexOf(action) != -1)                      
        };        
        self.viewingLocation = function(action) {
            return (['view-broadcast','view-response','view-link'].indexOf(action) != -1);
        };
        self.getMapOverlayMessage = getMapOverlayMessage;
        
        self.shareLocationUrl = '';
        self.shareLocationLinkButtonClick = function () {      
            document.querySelector('#shareLocationLinkTextbox').select();            
            document.execCommand('copy');
        }
        
        self.updateUrlTextbox = function(location, latLng) {                
            var locationStr = encodeURIComponent(
                location.building + ";" 
                + location.level + ";" 
                + latLng.lat.toFixed(4) + "," + latLng.lng.toFixed(4)
            );                                           
            var queryParamStr = 'link=1' + '&' + 'linkLocation=' + locationStr;                                                                                               
            self.shareLocationUrl = 'http://' + $location.host() 
                + ':' + $location.port() 
                + '/#/map?'+ queryParamStr;
            
        }

        var userMarker = L.marker(L.latLng(0,0), {
            icon: L.icon({
                iconUrl:    '/img/map-icons/user-marker.png',
                iconSize:   [50,50],
                iconAnchor: [25,50],
                popupAnchor:[0,0]
            }),                                
            draggable: self.choosingLocation($scope.action)
        }); 

        self.panToMarker = function() {
            self.setMapView(userMarker.getLatLng());
        }
            
        mapFunctions(self, {
            $location: $location,
            $stateParams: $stateParams,
            userMarker: userMarker
        });                        
        
        // Assume received location is valid (and maps exist)
        if (self.viewingLocation($stateParams.action)) {              
            var location = {};
            
            if ($stateParams.action == 'view-link')
                location = $stateParams.target;
            else 
                location = $stateParams.target.data.location;
            
            self.currentLocation = location;
            self.updateMap();
            userMarker.setLatLng(L.latLng(location.latLng.lat, location.latLng.lng));
            self.setMapView(userMarker.getLatLng());
        } else if (self.choosingLocation($stateParams.action)) {
            var profile = userService.profile;            
            if (profile != null && profile.defaultLoc != null) { 
                self.currentLocation = profile.defaultLoc;                
                self.updateMap();
                userMarker.setLatLng(L.latLng(profile.defaultLoc.latLng.lat, profile.defaultLoc.latLng.lng));
                self.setMapView(userMarker.getLatLng());                
            } else {             
                self.updateMap();            
                var viewData = getMapViewData(self.mapViewData, self.currentLocation);
                var originLatLng = L.latLng(viewData.origin.latLng[0], viewData.origin.latLng[1]);                
                userMarker.setLatLng(originLatLng)
                self.setMapView(originLatLng);                
            }
        } else {            
            self.updateMap();
        } 
        
        userMarker.on('move', function(e){                        
            $scope.$apply(function() {
                self.updateUrlTextbox(self.currentLocation, e.latlng);
            })
        });
             
        requestFunctions(self, {            
            $scope: $scope,     
            $rootScope: $rootScope,
            $state: $state,
            wsService: wsService,
            userService: userService,
            userMarker: userMarker
        });        
}]);   

function mapFunctions(self, dep) {
    
    var map = L.map('map');
    var tileLayer = L.tileLayer("").addTo(map);
    var itemLayer = L.layerGroup().addTo(map);
         
    self.updateMap = function () { // Change floor map when level is changed        
        var viewData = getMapViewData(self.mapViewData, self.currentLocation);                                       
        
        self.unsupportedMap = (viewData == null);
        if (self.unsupportedMap) {                        
            viewData = getMapViewData(self.mapViewData, { building: "default", level: "default" });                                               
        }               
        
        map.setView([viewData.origin.latLng[0], viewData.origin.latLng[1]], viewData.zoom.min+1)                                                         
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
                        
        dep.userMarker.addTo(map);             
         
        if (self.choosingLocation(dep.$stateParams.action) 
            || self.viewingLocation(dep.$stateParams.action)) {                
            dep.userMarker.addTo(map);                                       
        } else {
            map.removeLayer(dep.userMarker);   
        }
        
        map.removeLayer(itemLayer);
        itemLayer = L.layerGroup().addTo(map);        
        
        initialiseItemLayer(self, {
            map: map,
            itemLayer: itemLayer            
        });       
                    
        //TODO Change markers
    }        
        
    map.on('click', function(e) {                    
        console.log(e.latlng.lat.toFixed(4) + "," + e.latlng.lng.toFixed(4));
        
        if (self.choosingLocation(dep.$stateParams.action)) {                       
            dep.userMarker.setLatLng(e.latlng);
            dep.userMarker.addTo(map);            
        }                              
    });
    
    self.isMapSupportedClass = function() {
        return { 'map-disabled': self.unsupportedMap }
    }
    
    self.setMapView = function(latLng) {        
        var viewData = getMapViewData(self.mapViewData, self.currentLocation);
        map.setView(latLng, viewData.zoom.min+1 , { animate: true });        
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

    self.sendResponseButtonClick = function(target) {
        var request = target;
        dep.wsService.sendResponse(dep.$rootScope.user, request, {
            building: self.currentLocation.building,
            level: self.currentLocation.level,
            latLng: dep.userMarker.getLatLng()
        }); // Parent is notified as observer from wsService (for toast)        
    }
 
    self.sendBroadcastButtonClick = function(target) {
        var recipient = target;
        dep.wsService.sendBroadcast(dep.$rootScope.user, recipient, {
            building: self.currentLocation.building,
            level: self.currentLocation.level,
            latLng: dep.userMarker.getLatLng()
        }); // Parent is notified as observer from wsService (for toast)        
    }
    
    self.sendBroadcastToGroupButtonClick = function(target) {
        var group = target;
        group.forEach(function(staff) {
            dep.wsService.sendBroadcast(dep.$rootScope.user, staff, {
                building: self.currentLocation.building,
                level: self.currentLocation.level,
                latLng: dep.userMarker.getLatLng()
            });                        
        })
    }
    
    self.setDefaultLocationButtonClick = function() {        
        dep.userService.setDefaultLoc({
            building: self.currentLocation.building,
            level: self.currentLocation.level,
            latLng: dep.userMarker.getLatLng()
        }).then(function success(response) {
            dep.userService.profile.defaultLoc = response.data.defaultLoc;            
            dep.$scope.$emit('set-default-loc', 'loc');            
            dep.$state.go('user');
        }, function error(response) {            
            // TODO: Handle error gracefully
        });        
    }
    
}

// Read itemdata and set up icons
function initialiseItemLayer(self, dep) {
    
    var itemData = getMapItemData(self.mapItemData, self.currentLocation);
    
    if (!self.unsupportedMap && itemData != null) {            
        
        var H = getMapItemDataHeaders(self.mapItemData);
        var IconTypes = getIconTypes();
        
        var meetingRoomLayer = L.layerGroup().addTo(dep.itemLayer);
        itemData.meetingRooms.forEach(function(room) {                             
            var marker = L.marker( [room[H.MEETING_ROOM.LATLNG][0], room[H.MEETING_ROOM.LATLNG][1]],
                { icon: createIcon(IconTypes.MEETING_ROOM) })
                .addTo(meetingRoomLayer)
                .bindPopup("<b>Meeting room</b> " + room[H.MEETING_ROOM.NAME] + "<br>"
                            + "Capacity: " + room[H.MEETING_ROOM.CAPACITY] + "<br>"
                            + room[H.MEETING_ROOM.INFO]);                
        });
        
        var liftLayer = L.layerGroup().addTo(dep.itemLayer);
        itemData.lifts.forEach(function(lift) {                
            L.marker( [lift[H.LIFT.LATLNG][0], lift[H.LIFT.LATLNG][1]],
                { icon: createIcon(IconTypes.LIFT(lift[H.LIFT.TYPE])) })
                .addTo(liftLayer)
                .bindPopup("<b>" + capitalise(lift[H.LIFT.TYPE]) + "</b>");                
        });
        
        var toiletLayer = L.layerGroup().addTo(dep.itemLayer);
        itemData.toilets.forEach(function(toilet) {
            L.marker( [toilet[H.TOILET.LATLNG][0], toilet[H.TOILET.LATLNG][1]],
                { icon: createIcon(IconTypes.TOILET(toilet[H.TOILET.TYPE])) })
                .addTo(toiletLayer)
                .bindPopup("<b>Toilets</b><br>" + capitalise(toilet[H.TOILET.TYPE]));                
        });
        
        var otherLayer = L.layerGroup().addTo(dep.itemLayer);
        itemData.other.forEach(function(other) {
            L.marker( [other[H.OTHER.LATLNG][0], other[H.OTHER.LATLNG][1]],
                { icon: createIcon(IconTypes.OTHER(other[H.OTHER.TYPE])) })
                .addTo(otherLayer)
                .bindPopup("<b>" + capitalise(other[H.OTHER.TYPE]) + "</b>"
                            + ((other[H.OTHER.NAME] != null) ? "<br>" + other[H.OTHER.NAME] : ""));                                                                                   
        });        
    }                
}

// Get text for map overlay message 
function getMapOverlayMessage(action, target) {
    
    switch (action) {
        case 'set-default-loc':
            return 'Set your default location.';
        case 'view-link':
            return 'Viewing a location from a link.';
        case 'share-link':
            return 'Share your location with the link below.';
        case 'view-response':
            return 'Viewing ' + target.data.senderName + '\'s location';
        default:
            return 'Place the pin at your location.';                            
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

// Get name of folder for a building and level
function getLocationFolder(currentLocation) {
    var locationFolder = currentLocation.building + ' ' + currentLocation.level;
    return locationFolder.replace(/\s/g, '_');           
}

// View data corresponds to map-specific view settings (origin, bounds, etc)
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

// Item data corresponds to the various POIs on a map (meeting rooms, lifts, etc)
function getMapItemData(allItemData, currentLocation) {
            
    var result = null;
    allItemData.data.forEach(function(location) {
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

// Item data is stored without headers for compactness
function getMapItemDataHeaders(allItemData) {
    var headers = allItemData.headers;
    return {
        MEETING_ROOM: {
            NAME: headers.meetingRoom.indexOf('name'),
            LATLNG: headers.meetingRoom.indexOf('latlng'),
            CAPACITY: headers.meetingRoom.indexOf('capacity'),
            INFO: headers.meetingRoom.indexOf('info')        
        },
        LIFT: {
            TYPE: headers.lift.indexOf('type'),
            LATLNG: headers.lift.indexOf('latlng')
        },    
        TOILET: {
            TYPE: headers.toilet.indexOf('type'),
            LATLNG: headers.toilet.indexOf('latlng')
        },
        OTHER: {
            NAME: headers.other.indexOf('name'),    
            TYPE: headers.other.indexOf('type'),            
            LATLNG: headers.other.indexOf('latlng')
        }
    }
    
}

// Default options for icons
function getIconTypes() {
    
    return {
        MEETING_ROOM:   { size: 30, url: 'meeting' },
        LIFT: function(type) {
            return { size: 30, url: type };
        },
        TOILET: function(type) {
            return { size: 30, url: 'toilet-' + type };
        },
        OTHER: function(type) {
            return { size: 30, url: type };
        },
        USER_MARKER: { size:50, url: 'user-marker' }
    }
    
}
function createIcon(iconType) {
    return L.icon({
        iconUrl:        '/img/map-icons/' + iconType.url + '.png',
        iconSize:       [iconType.size, iconType.size],
        iconAnchor:     [iconType.size/2, iconType.size/2],
        popupAnchor:    [0,0] 
    });    
}

function getLinkLocation(linkLocation) {     
    console.log(linkLocation);
    var locationArray = linkLocation.split(';');
    var location = {
        building: locationArray[0],
        level: locationArray[1],
        latLng: {
            lat: locationArray[2].split(',')[0],
            lng: locationArray[2].split(',')[1]
        }
    };
    console.log(location);
    return location;
}

function capitalise(token) {
      return token.charAt(0).toUpperCase() + token.slice(1);
}
