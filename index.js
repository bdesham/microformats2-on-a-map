const L = require('leaflet');

const map = L.map('map', {
	center: [51.505, -0.09],
	zoom: 13
});

const osm_url = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const osm_attribution = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
const osm_layer = new L.TileLayer(osm_url, {
	minZoom: 8,
	maxZoom: 12,
	attribution: osm_attribution
});		

map.addLayer(osm_layer);
