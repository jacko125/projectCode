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

miaApp.registerCtrl('mapController', [function() { 
        var self = this;        
        
        self.title = 'Map';
        self.message = 'This page allows you to view an interactive map of your floor';

        var map = new L.map('map').setView([42.35, -71.08], 13);
        L.tileLayer('http://tiles.mapc.org/basemap/{z}/{x}/{y}.png',
                {
                    attribution: 'Tiles by <a href="http://mapc.org">MAPC</a>, Data by <a href="http://mass.gov/mgis">MassGIS</a>',
                    maxZoom: 17,
                    minZoom: 9
                }).addTo(map);

        map.on('click', function(e) {
            console.log(e);
            L.marker(e.latlng).addTo(map);
        }
        );

        navigator.geolocation.getCurrentPosition(
                function(pos) {
                    console.log(pos);
                    L.marker([pos.coords.latitude, pos.coords.longitude]).addTo(map);
                },
                function(err) {
                    console.log(err);
                }
        );

}]);   

