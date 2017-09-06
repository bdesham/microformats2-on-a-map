const leaflet = require('leaflet');
const request = require('request-promise-native');

let map;
let marker_layer;

// Returns, in an array, all the parts of "text" that look like HTTP or HTTPS URLs.
function extract_urls(text) {
	return text.match(/(\bhttps?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
}

function initialize_map() {
	map = leaflet.map('map', {
		center: [0, 0],
		zoom: 1
	});

	const osm_url = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	const osm_attribution = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	const osm_layer = new leaflet.TileLayer(osm_url, {
		minZoom: 1,
		maxZoom: 16,
		attribution: osm_attribution
	});		
	map.addLayer(osm_layer);

	marker_layer = new leaflet.featureGroup();
	map.addLayer(marker_layer);
}

function map_these_urls_handler() {
	marker_layer.clearLayers();

	const entered_text = document.getElementById('urls').value;

	const urls = extract_urls(entered_text);
	const request_promises = urls.map(url =>
		request.get({
			uri: document.location.origin + '/extract_locations',
			qs: {
				url: url,
			},
			gzip: true,
			json: true
		}).then(function(places) {
			places.forEach(place =>
				leaflet.marker([place.latitude, place.longitude])
					.bindPopup(place.title)
					.addTo(marker_layer));
		}).catch(function(reason) {
			console.error(reason);
		}));

	Promise.all(request_promises).then(function() {
		map.fitBounds(marker_layer.getBounds());
	});
}

function start() {
	initialize_map();
	document.getElementById('do-it').addEventListener('click', map_these_urls_handler);
}

start();
