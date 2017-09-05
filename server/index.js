const express = require('express');
const microformats = require('microformat-node');
const request = require('request-promise-native');

// Helper functions

function get_places_from_mf2_data(data) {
	return data.items.filter(item => item.type.includes('h-adr') || item.type.includes('h-geo'));
}

function geotag_places(places) {
	return Promise.all(places.map(geotag_place));
}

function geotag_place(place) {
	return Object.assign({latitude: 31, longitude: -88}, place);
}

// Entry point

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
		.then(geotag_places)
		.then(results => res.send(results))
		.catch(function(error) {
			console.error(error);
			res.status(500).send('Sorry, a server error occurred.');
		});
});

app.listen(8000);
