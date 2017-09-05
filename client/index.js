const leaflet = require('leaflet');
const request = require('request-promise-native');

let map;

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
}

function handle_mf2_data(data, url) {
	const places = JSON.parse(data);
	return places.map(place => Object.assign({annotation: url}, place));
}

function add_markers(places) {
	places.forEach(place =>
		leaflet.marker([place.latitude, place.longitude])
			.bindPopup(place.annotation)
			.addTo(map));
}

function map_these_urls_handler() {
	const entered_text = document.getElementById('urls').value;

	let urls = extract_urls(entered_text);
	urls = urls.slice(0, 1);
	const request_promises = urls.map(url =>
		request.get({
			uri: document.location.origin + '/extract_locations',
			qs: {
				url: url,
			},
			gzip: true
		}).then(data => handle_mf2_data(data, url))
		.then(add_markers)
		.catch(function(reason) {
			console.error(reason);
		}));
}

function start() {
	initialize_map();
	document.getElementById('do-it').addEventListener('click', map_these_urls_handler);
}

start();
