const microformats = require('microformat-node');

function find_locatable_microformats(html) {
	const objects = microformats.get({html: html});
	return objects.items.filter(item => item.type.includes('h-adr') || item.type.includes('h-geo'));
}

function geotag_places(places, containing_url, geocode) {
	return Promise.all(places.map(place => geotag_place(place, containing_url, geocode)));
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

function geotag_place(place, url, geocode) {
	const geo = try_to_extract_h_geo(place);
	if (geo) {
		return Promise.resolve(geo);
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

	return geocode(address)
		.then(coords => Object.assign({title: title}, coords));
}

module.exports = {
	find_locatable_microformats,
	geotag_places
};
