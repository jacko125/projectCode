miaApp.controller('meetingController', [
    '$http', '$window', '$scope','$rootScope', '$state', '$stateParams',
    'mapService','wsService', 'userService',
    function($http, $window, $scope, $rootScope, $state, $stateParams,
             mapService, wsService, userService) {              
        var self = this;        
        
        var defaultLocation = {
            building: 'All buildings',
            level: 'All levels', 
            capacity: '--',
            roomName: ''
        };
                
        if ($rootScope.user != null) {
            mapService.meetingSearch = mapService.getUserLocation($rootScope.user);                       
        } else if (mapService.meetingSearch == null) {
            mapService.meetingSearch = defaultLocation;            
        }
        self.currentLocation = mapService.meetingSearch;           
 
        self.mapViewData = mapViewData;   
        self.mapItemData = mapItemData;
        
        // Instantiate form fields
        self.allLocations = [].concat(self.mapViewData);                        
        self.allLocations.shift(); // Remove default map from list                
        self.allBuildings = ['All buildings'].concat(self.allLocations.map(function(loc) { return loc.building }));        
        self.allLevels = ['All levels'].concat(mapService.getBuildingLevels(self.currentLocation.building, self.allLocations));                 
        self.allCapacities = ['Any', '1 - 5', '5 - 10', '10+'];                   
                
        // Form control change handlers
        self.changeBuilding = function (building) { 
            self.currentLocation.roomName = '';
            mapService.meetingSearch.building = building;            
            self.allLevels = ['All levels'].concat(mapService.getBuildingLevels(self.currentLocation.building, self.allLocations));  // Get levels of the current building                      
            self.currentLocation.level = self.allLevels[0]; // Defaults to 'All levels'              
            self.currentRooms = getFilteredRooms(self.allRooms,
                                                 self.currentLocation.building,
                                                 self.currentLocation.level,
                                                 self.currentLocation.capacity);                    
        }
        self.changeLevel = function(level) {
            self.currentLocation.roomName = '';
            self.currentLocation.level = level;            
            self.currentRooms = getFilteredRooms(self.allRooms,
                                                 self.currentLocation.building,
                                                 self.currentLocation.level,
                                                 self.currentLocation.capacity);
        }
        self.changeCapacity = function(capacity) {
            self.currentLocation.roomName = '';
            self.currentLocation.capacity = capacity;
            self.currentRooms = getFilteredRooms(self.allRooms,
                                                 self.currentLocation.building,
                                                 self.currentLocation.level,
                                                 self.currentLocation.capacity);            
        }                
        self.changeName = function() {
            // Room names are in the following format: BUILDING__ROOMID
            // e.g. 1MP_1.19, 50MP_5.59, 1SS_7.79
            var roomName = self.currentLocation.roomName.toUpperCase();                                    
            var match = roomName.match(/([0-9]+[A-Z]+)_([0-9]+\.[0-9]+)/);
            if (match != null) {
                var buildingStr = match[1]
                var roomStr = match[2];
                                
                // Generate "building initials" for known buildings (e.g. 1MP, 50MP)
                // Change building if the building in the "room name" is found.
                self.allBuildings.forEach(function(building) {                    
                    if (building == 'All buildings') return;                    
                    var bArray = building.split(' ');
                    var streetNum = bArray.splice(0,1);                                       
                    var initials = bArray.map(function(str) { return str.charAt(0); }).join('');                                               
                    if ((streetNum + initials) == buildingStr) {
                        self.changeBuilding(building);
                    }
                });                
                self.allLevels.forEach(function(level) {
                    if (level == 'All levels') return;
                    var levelStr = "L " + roomStr.split('.')[0];                    
                    if (levelStr == level) {                        
                        self.changeLevel(level);
                    }                   
                })                
                self.currentRooms = self.currentRooms.filter(function(room) {
                    return room.name == roomStr;
                });
                self.currentLocation.roomName = roomName;
                self.currentLocation.capacity = 'Any';
            }                                    
        }
                        
        // Populate "all rooms" cache
        var H = mapService.getMapItemDataHeaders(mapItemData);
        self.allRooms = [];        
        self.currentRooms = [];
        self.mapItemData.data.forEach(function (location) {
            location.levels.forEach(function(level) {
                level.meetingRooms.forEach(function(room) {
                    self.allRooms.push({
                        name: room[H.MEETING_ROOM.NAME],
                        capacity: room[H.MEETING_ROOM.CAPACITY],
                        building: location.building,
                        level: level.name,
                        info: room[H.MEETING_ROOM.INFO],
                        latLng: {
                            lat: room[H.MEETING_ROOM.LATLNG][0],
                            lng: room[H.MEETING_ROOM.LATLNG][1]
                        }
                    });
                });
            });
        });        
        
        self.currentRooms = getFilteredRooms(self.allRooms,
                                             self.currentLocation.building,
                                             self.currentLocation.level,
                                             self.currentLocation.capacity);                                    
}]);

// Check if given room fits given capacity option
function isRoomCapacity(capacity, room) {
    var roomCap = parseInt(room.capacity)
    switch(capacity) {
        case '--':
            return false;
        case '1 - 5':
            return (roomCap <= 5);
        case '5 - 10':
            return (roomCap >= 5 && roomCap <= 10);
        case '10+':
            return (roomCap >= 10);
        default:
            return true;
    }
}

// Returns all rooms matching given criteria
function getFilteredRooms(rooms, building, level, capacity) {
    return rooms.filter(function(room) {        
        var isBuilding = (building == 'All buildings') 
                        || (room.building == building);
        var isLevel = (level == 'All levels') 
                        || (room.level == level);                                
        var isCapacity = (capacity == 'Any')
                            || (isRoomCapacity(capacity, room));               
        return (isBuilding && isLevel && isCapacity);        
    }).sort(function(a, b) {
        return a.name - b.name;
    });            
}

