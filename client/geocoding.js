const check_fetch_status = require('./check_fetch_status');
const package = require('../package');
const prepare_query_url = require('./prepare_query_url');
require('whatwg-fetch');

const cache = new Map();

const user_agent = 'microformats2-on-a-map/' + package.version
	+ ' (+https://github.com/bdesham/microformats2-on-a-map)';

function geocode_address(address) {
	if (cache.has(address)) {
		return cache.get(address);
	}

	const url = prepare_query_url('http://nominatim.openstreetmap.org/search', {
		q: address,
		format: 'json',
		polygon_kml: 0,
		polygon_svg: 0,
		polygon_text: 0,
		extratags: 0,
		namedetails: 0
	});

	return fetch(url, {
		headers: {
			'User-Agent': user_agent
		}
	}).then(check_fetch_status)
		.then(response => response.json())
		.then(function(body) {
			if (body.length === 0) {
				throw new Error('Geocoding response did not include any results');
			} else {
				const processed_value = {
					latitude: body[0].lat,
					longitude: body[0].lon
				};
				cache.set(address, processed_value);
				return processed_value;
			}
		});
}

module.exports = geocode_address;
