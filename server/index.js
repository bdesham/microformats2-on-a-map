const express = require('express');
const request = require('request');

const app = express();

app.use(express.static('client'));

app.get('/proxy', function(req, res) {
	const url = req.query.url;
	if (url === undefined) {
		res.status(400).send('The "url" parameter is missing from the query string.');
		return;
	}

	request({
		uri: url,
		gzip: true
	}, function(error, response, body) {
		if (error) {
			console.error(error);
			res.status(500).send('An error occurred while fetching "' + url + '".');
		} else {
			res.status(response.statusCode).send(body);
		}
	});
});

app.listen(8000);
