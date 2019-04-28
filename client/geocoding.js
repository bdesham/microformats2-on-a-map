const check_fetch_status = require('./check_fetch_status');
const package = require('../package');
const prepare_query_url = require('./prepare_query_url');
const SequentialTaskQueue = require('sequential-task-queue');
require('whatwg-fetch');

const cache = new Map();
const queue = new SequentialTaskQueue.SequentialTaskQueue();

// Nominatim's usage policy forbids us from issuing more than one request per
// second. This variable keeps track of the time (in milliseconds since the
// Unix epoch) at which we last made a request. Its initial value is in the
// past so that we don't bother waiting before making our first request.
let last_request_time = 0;

const user_agent = 'microformats2-on-a-map/' + package.version
	+ ' (+https://esham.io/projects/microformats2-on-a-map)';

function geocode_address(address) {
	// This is almost certainly going to be a cache miss, since all of the
	// addresses are queued up at around the same time and there probably
	// hasn't been time yet to make a Nominatim request and receive the reply.
	// Might as well check, though.
	if (cache.has(address)) {
		return Promise.resolve(cache.get(address));
	}

	return queue.push(() => {
		if (cache.has(address)) {
			return Promise.resolve(cache.get(address));
		}

		const now = Date.now();
		const wait_time_millis = Math.max(0, (last_request_time + 1000) - now);
		const p = new Promise(function(resolve) {
			last_request_time = now + wait_time_millis;
			setTimeout(resolve, wait_time_millis);
		});

		return p.then(() => fetch_nominatim_data(address));
	});
}

function fetch_nominatim_data(address) {
	const url = prepare_query_url('https://nominatim.openstreetmap.org/search', {
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
