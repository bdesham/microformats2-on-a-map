const microformats = require('../client/microformats')
const test = require('blue-tape');

test('extracting one non-nested h-adr', function(t) {
	const html = `
		<p class="h-adr">
			<span class="p-region">Texas</span>,
			<span class="p-country-name">United States</span>
		</p>`;

	return microformats.find_locatable_microformats(html)
		.then(function(items) {
			t.equal(items.length, 1, 'one microformat was found');

			const item = items[0];

			t.deepEqual(item.type, ['h-adr'], 'the microformat was an h-adr');
			t.deepEqual(item.properties.region, ['Texas'], 'the region was parsed correctly');
			t.deepEqual(item.properties['country-name'], ['United States'], 'the country was parsed correctly');
		});
});

test('extracting one non-nested h-geo', function(t) {
	const html = `
		<span class="h-geo">
			<data class="p-latitude" value="45.4340"/>
			<data class="p-longitude" value="12.3388"/>
		</span>`;

	return microformats.find_locatable_microformats(html)
		.then(function(items) {
			t.equal(items.length, 1, 'one microformat was found');

			const item = items[0];

			t.deepEqual(item.type, ['h-geo'], 'the microformat was an h-geo');
			t.deepEqual(item.properties.latitude, ['45.4340'], 'the latitude was parsed correctly');
			t.deepEqual(item.properties.longitude, ['12.3388'], 'the longitude was parsed correctly');
		});
});
