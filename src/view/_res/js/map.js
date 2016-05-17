miaApp.controller('mapController', [
    '$rootScope', '$scope', '$state', '$stateParams', '$location',
    'mapService', 'requestService', 'wsService', 'userService',
    function(                  
        $rootScope, $scope, $state, $stateParams, $location, 
        mapService, requestService, wsService, userService) { 
        
        var self = this;
        
        // Loaded from server on parent.html
        self.mapViewData = mapViewData; 
        self.mapItemData = mapItemData;                
        
        if ($stateParams.link != null) { // Viewing location from link
            $stateParams.action = 'view-link';            
            $stateParams.target = $stateParams.linkLocation;
        }
        else if ($stateParams.action == null) // Default to sharing link view
            $stateParams.action = 'share-link';                              
                                       
        $scope.action = $stateParams.action; // Action being taken
        $scope.target = $stateParams.target; // Data associated with action                               
        
        var defaultLocation = { building: '1 MARTIN PLACE', level: 'L 1' };
        self.currentLocation = ($rootScope.user) ? mapService.getUserLocation($rootScope.user) : defaultLocation;                                           
 
        self.allLocations = [];
        self.allLocations = self.allLocations.concat(self.mapViewData);                        
        self.allLocations.shift(); // Remove default map from list        
                
        self.unsupportedMap = (mapService.getMapViewData(self.allLocations, self.currentLocation) == null)
        
        self.allBuildings = []; // Get all buildings
        for (var i = 0; i < self.allLocations.length; i++) 
            self.allBuildings.push(self.allLocations[i].building);                
        self.allLevels = mapService.getBuildingLevels(self.currentLocation.building, self.allLocations);  // Get levels of the current building                      
                
        self.changeBuilding = function (building) { 
            self.currentLocation.building = building;
            self.allLevels = mapService.getBuildingLevels(self.currentLocation.building, self.allLocations);  // Get levels of the current building                      
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
            return (['send-broadcast',          // target: staffProfile
                     'send-broadcast-group',    // target: array[staffProfile]
                     'send-response',           // target: message (type: request)
                     'share-link',  
                     'set-default-loc']         // target: profile (from userService)
                     .indexOf(action) != -1)                      
        };        
        self.viewingLocation = function(action) {
            return (['view-broadcast',  // target: message (type: broadcast)
                     'view-response',   // target: message (type: response)
                     'view-room',       // target: room (from meetingController)
                     'view-link']       // target: location (from link)
                     .indexOf(action) != -1);
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
            mapService: mapService,
            userMarker: userMarker
        });                        
        
        // Assume received location is valid (and maps exist)
        if (self.viewingLocation($stateParams.action)) {              
            var location = {};            
            switch ($stateParams.action) {
                case 'view-link':
                    location = mapService.getLinkLocation($stateParams.target);
                    break;
                case 'view-room':
                    location = $stateParams.target; // Rooms are a subset of locations                    
                    break;
                default:
                    location = $stateParams.target.data.location
            }                                
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
                var viewData = mapService.getMapViewData(self.mapViewData, self.currentLocation);
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
        var viewData = dep.mapService.getMapViewData(self.mapViewData, self.currentLocation);                                       
        
        self.unsupportedMap = (viewData.building == 'default');     
        
        map.setView([viewData.origin.latLng[0], viewData.origin.latLng[1]], viewData.zoom.min+1)                                                         
        var southWest = L.latLng(viewData.bounds.SW[0], viewData.bounds.SW[1]),
            northEast = L.latLng(viewData.bounds.NE[0], viewData.bounds.NE[1]),
            bounds = L.latLngBounds(southWest, northEast);
        map.setMaxBounds(bounds);   
       
        map.removeLayer(tileLayer);
        var url = 'http://' + dep.$location.host() 
                    + ':' + dep.$location.port() 
                    + '/maps/' + dep.mapService.getLocationFolder(self.currentLocation) 
                    + '/{z}/{x}/{y}.png';
        
        tileLayer = L.tileLayer(url, {
            maxZoom: viewData.zoom.max,
            minZoom: viewData.zoom.min,
            continuousWorld: false,
            noWrap: true
        }).addTo(map);
                                         
        dep.userMarker.addTo(map);        
        if (dep.$stateParams.action == 'view-room') {
            map.removeLayer(dep.userMarker);
        }
        
        map.removeLayer(itemLayer);
        itemLayer = L.layerGroup().addTo(map);                
        initialiseItemLayer(self, {
            $stateParams: dep.$stateParams,
            map: map,
            itemLayer: itemLayer,
            mapService: dep.mapService,            
        });       
                    
        //TODO Change markers
    }        
        
    map.on('click', function(e) {                    
        console.log(e.latlng.lat.toFixed(4) + "," + e.latlng.lng.toFixed(4));
        
        if (self.choosingLocation(dep.$stateParams.action)) {                       
            dep.userMarker.setLatLng(e.latlng);            
        }                              
    });
    
    self.isMapSupportedClass = function() {
        return { 'map-disabled': self.unsupportedMap }
    }
    
    self.setMapView = function(latLng) {        
        var viewData = dep.mapService.getMapViewData(self.mapViewData, self.currentLocation);
        map.setView(latLng, viewData.zoom.min+1 , { animate: true });        
    }
    
    //Get current position from GPS coordinates (Only for mobile devices)
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

// Handlers for map-bottombutton actions
function requestFunctions(self, dep) {

    self.sendResponseButtonClick = function(target) {
        var request = target;
        dep.wsService.sendResponse(dep.$rootScope.user, request, {
            building: self.currentLocation.building,
            level: self.currentLocation.level,
            latLng: dep.userMarker.getLatLng()
        });
    }
 
    self.sendBroadcastButtonClick = function(target) {
        var recipient = target;
        dep.wsService.sendBroadcast(dep.$rootScope.user, recipient, {
            building: self.currentLocation.building,
            level: self.currentLocation.level,
            latLng: dep.userMarker.getLatLng()
        }); 
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
    
    var itemData = dep.mapService.getMapItemDataForLevel(self.mapItemData, self.currentLocation);
    
    if (!self.unsupportedMap && itemData != null) {            
        
        var H = dep.mapService.getMapItemDataHeaders(self.mapItemData);        
        
        var meetingRoomLayer = L.layerGroup().addTo(dep.itemLayer);
        itemData.meetingRooms.forEach(function(room) {                             
            var marker = L.marker( [room[H.MEETING_ROOM.LATLNG][0], room[H.MEETING_ROOM.LATLNG][1]],
                { icon: createIcon(IconTypes.MEETING_ROOM) })
                .addTo(meetingRoomLayer);
            marker.bindPopup("<b>Meeting room (" + room[H.MEETING_ROOM.CAPACITY] + ")</b>" 
                            + "<br>" + dep.mapService.getMeetingRoomName(self.currentLocation, room[H.MEETING_ROOM.NAME])
                            + ((room[H.MEETING_ROOM.INFO].length > 0) ? "<br>" + room[H.MEETING_ROOM.INFO] : ""));
                            // + "<br>[" + marker.getLatLng().lat.toFixed(4) + "," 
                            // + marker.getLatLng().lng.toFixed(4) + "]");
                            
            if (dep.$stateParams.action == 'view-room'
                && dep.$stateParams.target.latLng.lat == room[H.MEETING_ROOM.LATLNG][0]
                && dep.$stateParams.target.latLng.lng == room[H.MEETING_ROOM.LATLNG][1])
                marker.openPopup();                
        });
        
        var liftLayer = L.layerGroup().addTo(dep.itemLayer);
        itemData.lifts.forEach(function(lift) {                
            var marker = L.marker( [lift[H.LIFT.LATLNG][0], lift[H.LIFT.LATLNG][1]],
                { icon: createIcon(IconTypes.LIFT(lift[H.LIFT.TYPE])) })
                .addTo(liftLayer);
            marker.bindPopup("<b>" + capitalise(lift[H.LIFT.TYPE]) + "</b>");
                    // + "<br>[" + marker.getLatLng().lat.toFixed(4) + "," 
                    // + marker.getLatLng().lng.toFixed(4) + "]");
        });
        
        var toiletLayer = L.layerGroup().addTo(dep.itemLayer);
        itemData.toilets.forEach(function(toilet) {
            var marker = L.marker( [toilet[H.TOILET.LATLNG][0], toilet[H.TOILET.LATLNG][1]],
                { icon: createIcon(IconTypes.TOILET(toilet[H.TOILET.TYPE])) })
                .addTo(toiletLayer);                
            marker.bindPopup("<b>Toilets</b><br>" 
                    + capitalise(toilet[H.TOILET.TYPE]));
                    // + "<br>[" + marker.getLatLng().lat.toFixed(4) + "," 
                    // + marker.getLatLng().lng.toFixed(4) + "]");
        });
        
        var otherLayer = L.layerGroup().addTo(dep.itemLayer);
        itemData.other.forEach(function(other) {
            var marker = L.marker( [other[H.OTHER.LATLNG][0], other[H.OTHER.LATLNG][1]],
                { icon: createIcon(IconTypes.OTHER(other[H.OTHER.TYPE])) })
                .addTo(otherLayer);
            marker.bindPopup("<b>" + ((other[H.OTHER.NAME].length > 0) ? other[H.OTHER.NAME] : other[H.OTHER.TYPE]) + "</b>");
                            //+ "<br>[" + marker.getLatLng().lat.toFixed(4) + "," 
                            //+ marker.getLatLng().lng.toFixed(4) + "]");
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
        case 'view-room': 
            return 'Viewing meeting room ' + target.name + '.';
        case 'share-link':
            return 'Share your location with the link below.';
        case 'view-response':
            return 'Viewing ' + target.data.senderName + '\'s location';
        case 'view-broadcast':
            return 'Viewing location sent by ' + target.data.senderName + '.';
        default:
            return 'Place the pin at your location.';                            
    }
}

// Default options for icons
var IconTypes = {
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

// Create Leaflet.js icon from an iconType
function createIcon(iconType) {
    return L.icon({
        iconUrl:        '/img/map-icons/' + iconType.url + '.png',
        iconSize:       [iconType.size, iconType.size],
        iconAnchor:     [iconType.size/2, iconType.size/2],
        popupAnchor:    [0,0] 
    });    
}

function capitalise(token) {
      return token.charAt(0).toUpperCase() + token.slice(1);
}
