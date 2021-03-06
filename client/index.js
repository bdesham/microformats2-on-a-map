const check_fetch_status = require('./check_fetch_status');
const geocode_address = require('./geocoding');
const leaflet = require('leaflet');
const microformats = require('./microformats');
const prepare_query_url = require('./prepare_query_url');
require('leaflet.markercluster');
require('whatwg-fetch');

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

	const osm_url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	const osm_attribution = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	const osm_layer = new leaflet.TileLayer(osm_url, {
		minZoom: 1,
		maxZoom: 16,
		attribution: osm_attribution
	});
	map.addLayer(osm_layer);

	marker_layer = new leaflet.markerClusterGroup({
		showCoverageOnHover: false
	});
	map.addLayer(marker_layer);
}

function handle_html() {
	marker_layer.clearLayers();

	const entered_text = document.getElementById('urls').value;

	microformats.find_locatable_microformats(entered_text)
		.then(places => microformats.geotag_places(places, null, geocode_address))
		.then(function(places) {
			places.forEach(place =>
				leaflet.marker([place.latitude, place.longitude])
					.bindPopup(place.title)
					.addTo(marker_layer));
		}).then(function() {
			map.fitBounds(marker_layer.getBounds());
		}).catch(function(reason) {
			console.error(reason);
		});
}

function handle_urls() {
	marker_layer.clearLayers();

	const entered_text = document.getElementById('urls').value;

	const urls = extract_urls(entered_text);
	const request_promises = urls.map(function(url) {
		const request_uri = prepare_query_url(document.location.origin + '/proxy', {url: url});
		return fetch(request_uri)
			.then(check_fetch_status)
			.then(response => response.text())
			.then(microformats.find_locatable_microformats)
			.then(places => microformats.geotag_places(places, url, geocode_address))
			.then(function(places) {
				places.forEach(place =>
					leaflet.marker([place.latitude, place.longitude])
						.bindPopup(place.title)
						.addTo(marker_layer));
			}).catch(function(reason) {
				console.error(reason);
			});
	});

	Promise.all(request_promises).then(function() {
		map.fitBounds(marker_layer.getBounds());
	});
}

function do_it() {
	const selection = document.querySelector('input[name=text-purpose]:checked').value;
	if (selection === 'html') {
		handle_html();
	} else if (selection === 'urls') {
		handle_urls();
	}
}

function check_for_server() {
	fetch(document.location.origin + '/health')
		.then(function(response) {
			if (response.status === 200) {
				document.getElementById('text-purpose-selector').classList.remove('hidden');
				document.getElementById('enter-html-instruction').classList.add('hidden');
			}
		});
}

initialize_map();
document.getElementById('do-it').addEventListener('click', do_it);
check_for_server();
