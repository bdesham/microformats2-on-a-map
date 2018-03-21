const microformats = require('microformat-node');

if (!Object.values) {
	require('object.values').shim();
}

/* Given an array of Microformats2 objects, recursively looks for "h-adr" and
 * "h-geo" items, returning them in a flat array.
 */
function find_locations(objects) {
	let results = [];

	for (const object of objects) {
		if (object.type && (object.type.includes('h-adr') || object.type.includes('h-geo'))) {
			results.push(object);

			// There could be locations nested inside this one (in
			// object.properties or object.children), but that doesn't really
			// make sense semantically, so we just ignore them.
			continue;
		}

		if (object.properties) {
			for (const property_array of Object.values(object.properties)) {
				results = results.concat(find_locations(property_array));
			}
		}

		if (object.children) {
			results = results.concat(find_locations(object.children));
		}
	}

	return results;
}

function find_locatable_microformats(html) {
	return microformats.getAsync({html: html})
		.then(result => find_locations(result.items));
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

	let title;
	if (url) {
		title = `${address} (${url})`;
	} else {
		title = address;
	}

	return geocode(address)
		.then(coords => Object.assign({title: title}, coords));
}

module.exports = {
	find_locatable_microformats,
	geotag_places
};
