// This function is taken from https://github.com/github/fetch/tree/v2.0.3#handling-http-error-statuses
// and is therefore released under the MIT license.

function check_fetch_status(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	} else {
		const error = new Error(response.statusText);
		error.response = response;
		throw error;
	}
}

module.exports = check_fetch_status;
