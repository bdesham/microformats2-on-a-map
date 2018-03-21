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

test('extracting one nested h-adr', function(t) {
	const html = `
		<div class="h-entry"><p class="p-location h-adr">
			<span class="p-region">Texas</span>,
			<span class="p-country-name">United States</span>
		</p></div>`;

	return microformats.find_locatable_microformats(html)
		.then(function(items) {
			t.equal(items.length, 1, 'one microformat was found');

			const item = items[0];
			t.deepEqual(item.type, ['h-adr'], 'the microformat was an h-adr');
			t.deepEqual(item.properties.region, ['Texas'], 'the region was parsed correctly');
			t.deepEqual(item.properties['country-name'], ['United States'], 'the country was parsed correctly');
		});
});

test('extracting one nested h-geo', function(t) {
	const html = `
		<div class="h-entry"><span class="p-location h-geo">
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

test('extracting one non-nested h-geo with extraneous elements', function(t) {
	const html = `
		<div class="h-geo">
			<a class="p-latitude" href="http://example.com">28.3675</a>,
			<em class="p-longitude">-81.5<span class="p-dummy">4833</span>3</em>,
			<span class="p-ijustmadethisup">867-5309</span>
		</div>`;

	return microformats.find_locatable_microformats(html)
		.then(function(items) {
			t.equal(items.length, 1, 'one microformat was found');

			const item = items[0];
			t.deepEqual(item.type, ['h-geo'], 'the microformat was an h-geo');
			t.deepEqual(item.properties.latitude, ['28.3675'], 'the latitude was parsed correctly');
			t.deepEqual(item.properties.longitude, ['-81.548333'], 'the longitude was parsed correctly');
		});
});

test('extracting two non-nested h-geos', function(t) {
	const html = `
		<span class="h-geo">
			<data class="p-latitude" value="45.4340"/>
			<data class="p-longitude" value="12.3388"/>
		</span>
		<span class="h-geo">
			<data class="p-latitude" value="28.3675"/>
			<data class="p-longitude" value="-81.548333"/>
		</span>`;

	return microformats.find_locatable_microformats(html)
		.then(function(items) {
			t.equal(items.length, 2, 'two microformats were found');

			const one = items[0];
			t.deepEqual(one.type, ['h-geo'], 'the first microformat was an h-geo');
			t.deepEqual(one.properties.latitude, ['45.4340'], 'the first latitude was parsed correctly');
			t.deepEqual(one.properties.longitude, ['12.3388'], 'the first longitude was parsed correctly');

			const two = items[1];
			t.deepEqual(two.type, ['h-geo'], 'the second microformat was an h-geo');
			t.deepEqual(two.properties.latitude, ['28.3675'], 'the second latitude was parsed correctly');
			t.deepEqual(two.properties.longitude, ['-81.548333'], 'the second longitude was parsed correctly');
		});
});

test('extracting two nested h-geos', function(t) {
	const html = `
		<div class="h-entry">
			<span class="p-location h-geo">
				<data class="p-latitude" value="45.4340"/>
				<data class="p-longitude" value="12.3388"/>
			</span>
			<span class="p-location h-geo">
				<data class="p-latitude" value="28.3675"/>
				<data class="p-longitude" value="-81.548333"/>
			</span>
		</div>`;

	return microformats.find_locatable_microformats(html)
		.then(function(items) {
			t.equal(items.length, 2, 'two microformats were found');

			const one = items[0];
			t.deepEqual(one.type, ['h-geo'], 'the first microformat was an h-geo');
			t.deepEqual(one.properties.latitude, ['45.4340'], 'the first latitude was parsed correctly');
			t.deepEqual(one.properties.longitude, ['12.3388'], 'the first longitude was parsed correctly');

			const two = items[1];
			t.deepEqual(two.type, ['h-geo'], 'the second microformat was an h-geo');
			t.deepEqual(two.properties.latitude, ['28.3675'], 'the second latitude was parsed correctly');
			t.deepEqual(two.properties.longitude, ['-81.548333'], 'the second longitude was parsed correctly');
		});
});

test('extracting two h-geos at different levels of nesting (one is a subproperty)', function(t) {
	const html = `
		<div class="h-entry">
			<div class="p-author h-card">
				<span class="p-location h-geo">
					<data class="p-latitude" value="45.4340"/>
					<data class="p-longitude" value="12.3388"/>
				</span>
			</div>
			<span class="p-location h-geo">
				<data class="p-latitude" value="28.3675"/>
				<data class="p-longitude" value="-81.548333"/>
			</span>
		</div>`;

	return microformats.find_locatable_microformats(html)
		.then(function(items) {
			t.equal(items.length, 2, 'two microformats were found');

			const one = items[0];
			t.deepEqual(one.type, ['h-geo'], 'the first microformat was an h-geo');
			t.deepEqual(one.properties.latitude, ['45.4340'], 'the first latitude was parsed correctly');
			t.deepEqual(one.properties.longitude, ['12.3388'], 'the first longitude was parsed correctly');

			const two = items[1];
			t.deepEqual(two.type, ['h-geo'], 'the second microformat was an h-geo');
			t.deepEqual(two.properties.latitude, ['28.3675'], 'the second latitude was parsed correctly');
			t.deepEqual(two.properties.longitude, ['-81.548333'], 'the second longitude was parsed correctly');
		});
});

test('extracting two h-geos at different levels of nesting (one is a child)', function(t) {
	const html = `
		<div class="h-entry">
			<div class="h-card">
				<span class="p-location h-geo">
					<data class="p-latitude" value="45.4340"/>
					<data class="p-longitude" value="12.3388"/>
				</span>
			</div>
			<span class="p-location h-geo">
				<data class="p-latitude" value="28.3675"/>
				<data class="p-longitude" value="-81.548333"/>
			</span>
		</div>`;

	return microformats.find_locatable_microformats(html)
		.then(function(items) {
			t.equal(items.length, 2, 'two microformats were found');

			const one = items[0];
			t.deepEqual(one.type, ['h-geo'], 'the first microformat was an h-geo');
			t.deepEqual(one.properties.latitude, ['28.3675'], 'the first latitude was parsed correctly');
			t.deepEqual(one.properties.longitude, ['-81.548333'], 'the first longitude was parsed correctly');

			const two = items[1];
			t.deepEqual(two.type, ['h-geo'], 'the second microformat was an h-geo');
			t.deepEqual(two.properties.latitude, ['45.4340'], 'the second latitude was parsed correctly');
			t.deepEqual(two.properties.longitude, ['12.3388'], 'the second longitude was parsed correctly');
		});
});

test('an h-geo nested inside another one is ignored', function(t) {
	const html = `
		<div class="h-geo">
			<span class="h-geo">
				<data class="p-latitude" value="45.4340"/>
				<data class="p-longitude" value="12.3388"/>
			</span>
			<data class="p-latitude" value="28.3675"/>
			<data class="p-longitude" value="-81.548333"/>
		</div>`;

	return microformats.find_locatable_microformats(html)
		.then(function(items) {
			t.equal(items.length, 1, 'one microformat was found');

			const one = items[0];
			t.deepEqual(one.type, ['h-geo'], 'the microformat was an h-geo');
			t.deepEqual(one.properties.latitude, ['28.3675'], 'the latitude was parsed correctly');
			t.deepEqual(one.properties.longitude, ['-81.548333'], 'the longitude was parsed correctly');
		});
});
