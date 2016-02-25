miaApp.factory('mapService', ['$http', '$location','$rootScope',
    function($http, $location, $rootScope) {
    var self = this;   
    
    var meetingSearch = null; // Used for caching meeting search

    // Example "location" object used by mapController
    var location = {
        building: 'building',
        level: 'level',
        latLng: {
            lat: '0.0000',
            lng: '0.0000'
        }
    }

   // Get user's location from Macnet profile "postalAddress"
    var getUserLocation = function(user) {    
        // TODO: Handle NON-MACQUARIE BUILDING    
        var regex = /(L\s\d)\s(.*)/
        var locFields = user.postalAddress.match(regex);
        console.log('Building: ' + locFields[2] + ' Level: ' + locFields[1]);    
        return {
            building: locFields[2],
            level: locFields[1],
            capacity: 'Any' // Used for meeting room search default
        };
        
    }
    
    // Get levels for a given building
    var getBuildingLevels = function(currentBuilding, allLocations) { 
        for (var i = 0; i < allLocations.length; i++) 
            if (allLocations[i].building == currentBuilding)
                return allLocations[i].levels;        
        return [];
    }
    
    
    // Get name of folder for a building and level
    var getLocationFolder = function(currentLocation) {
        var locationFolder = currentLocation.building + ' ' + currentLocation.level;
        return locationFolder.replace(/\s/g, '_');           
    }
    
    
    // View data corresponds to map-specific view settings (origin, bounds, etc)
    var getMapViewData = function(allViewData, currentLocation) {
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
    var getMapItemDataForLevel = function(allItemData, currentLocation) {                
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
    var getMapItemDataHeaders = function(allItemData) {
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
    
    var getMeetingRoomName = function(location, roomName) {
        var bArray = location.building.split(' ');
        var streetNum = bArray.splice(0,1);                                       
        var initials = bArray.map(function(str) { return str.charAt(0); }).join('');
        return streetNum + initials + "_" + roomName;
    }
    
    // Get location object from given URL location parameter
    var getLinkLocation = function(linkLocation) {         
        var locationArray = linkLocation.split(';');
        var location = {
            building: locationArray[0],
            level: locationArray[1],
            latLng: {
                lat: locationArray[2].split(',')[0],
                lng: locationArray[2].split(',')[1]
            }
        };    
        return location;
    }        
    
    var clearCache = function(mapService) {
        mapService.meetingSearch = null;
    }
    
    return {               
        getUserLocation: getUserLocation,
        getBuildingLevels: getBuildingLevels,
        getLocationFolder: getLocationFolder,
        
        getMapViewData: getMapViewData,
        getMapItemDataForLevel: getMapItemDataForLevel,
        getMapItemDataHeaders: getMapItemDataHeaders,
        
        getMeetingRoomName: getMeetingRoomName,
        getLinkLocation: getLinkLocation,        
        clearCache: clearCache
    };
}])
