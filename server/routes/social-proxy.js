var oauthshim = require('oauth-shim');

module.exports = function (app) {
	oauthshim.getCredentials = function (id, callback) {
		console.log(id);
		// No Credentials?
		// Retrun NULL, and accept default handling
		if (!id) {
			callback(null);
			return;
		}

		//
		// Search the database
		// Get all the current stored credentials
		//
		return callback("LhzJG4br1tdtI34843GZRxC47c7RTVcga99Vb1tCXbZYMGlHPN");
	};

	app.use('/oauthproxy', oauthshim.interpret);
	app.use('/oauthproxy', oauthshim.proxy);
	app.use('/oauthproxy', function (req, res, next) {
		if (req.oauthshim && req.oauthshim.data && req.oauthshim.redirect) {

			var data = req.oauthshim.data;
			var opts = req.oauthshim.options;

			// Was this an OAuth Login response and does it contain a new access_token?
			if ("access_token" in data && !("path" in opts)) {
				// Store this access_token
				//			console.log("Session created", data.access_token.substr(0, 8) + '...');
				console.log("Session created", data);
			}
		}
		next();
	});
	app.use('/oauthproxy', oauthshim.redirect);
	app.use('/oauthproxy', oauthshim.unhandled);
};