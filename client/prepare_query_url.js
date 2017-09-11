// This polyfill was taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
// and therefore it's in the public domain.
if (!Object.entries) {
	Object.entries = function(obj) {
		const ownProps = Object.keys(obj);
		let i = ownProps.length;
		const resArray = new Array(i);

		while (i--) {
			resArray[i] = [ownProps[i], obj[ownProps[i]]];
		}
		
		return resArray;
	};
}

function prepare_query_url(url, parameters) {
	const pairs = Object.entries(parameters);
	if (pairs.length === 0) {
		return url;
	}

	const encoded_pairs = pairs.map(function(pair) {
		const k = pair[0];
		const v = pair[1];
		return encodeURIComponent(k) + '=' + encodeURIComponent(v);
	});
	return url + '?' + encoded_pairs.join('&');
}

module.exports = prepare_query_url;
