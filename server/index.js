const express = require('express');
const microformats = require('microformat-node');
const request = require('request-promise-native');

let google_api_key;

const geocoding_cache = new Map();

// Helper functions

function get_places_from_mf2_data(data) {
	return data.items.filter(item => item.type.includes('h-adr') || item.type.includes('h-geo'));
}

function geotag_places(places, url) {
	return Promise.all(places.map(place => geotag_place(place, url)));
}

function try_to_extract_h_geo(item) {
	if (item.type.includes('h-geo')
			&& item.properties.latitude
			&& item.properties.latitude.length >= 1
			&& !isNaN(parseFloat(item.properties.latitude[0]))
			&& item.properties.longitude
			&& item.properties.longitude.length >= 1
			&& !isNaN(parseFloat(item.properties.longitude[0]))) {
		return {
			latitude: parseFloat(item.properties.latitude[0]),
			longitude: parseFloat(item.properties.longitude[0])
		}
	} else {
		return null;
	}
}

function geotag_place(place, url) {
	const geo = try_to_extract_h_geo(place);
	if (geo) {
		return geo;
	}

	if (!google_api_key) {
		throw new Error('No h-geo information and geocoding is not possible');
	}

	const address_pieces = [
		place.properties["street-address"],
		place.properties["locality"],
		place.properties["region"],
		place.properties["postal-code"],
		place.properties["country-name"]
	];
	const address = address_pieces.filter(value => value !== undefined).join(', ');
	const title = `${address} (${url})`;

	if (geocoding_cache.has(address)) {
		console.log(`Address "${address}" was cached`);
		const cached_value = geocoding_cache.get(address);
		return Object.assign({title: title}, cached_value);
	}

	console.log(`Geocoding "${address}"`);

	return request({
		uri: 'https://maps.googleapis.com/maps/api/geocode/json',
		qs: {
			address: address,
			key: google_api_key
		},
		gzip: true,
		json: true
	}).then(function(body) {
		if (!body.results || body.results.length === 0) {
			throw new Error('Geocoding response did not include any results');
		} else {
			const value_to_cache = {
				latitude: body.results[0].geometry.location.lat,
				longitude: body.results[0].geometry.location.lng
			};
			geocoding_cache.set(address, value_to_cache);
			return Object.assign({title: title}, value_to_cache);
		}
	});
}

// Entry point

if (process.env.GOOGLE_API_KEY) {
	google_api_key = process.env.GOOGLE_API_KEY;
} else {
	console.log('Warning: No GOOGLE_API_KEY has been specified. Geocoding will not be possible.');
}

const app = express();

app.use(express.static('client'));
app.use('/images', express.static('node_modules/leaflet/dist/images'));

app.get('/extract_locations', function(req, res) {
	const url = req.query.url;
	if (url === undefined) {
		res.status(400).send('The "url" parameter is missing from the query string');
		return;
	}

	request({uri: url, gzip: true})
		.then(body => microformats.getAsync({html: body}))
		.then(get_places_from_mf2_data)
		.then(places => geotag_places(places, url))
		.then(results => res.send(results))
		.catch(function(error) {
			console.error(error);
			res.status(500).send('Sorry, a server error occurred.');
		});
});

app.listen(8000);
