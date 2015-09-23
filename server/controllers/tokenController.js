'use strict';

var debug = require('debug')('betSport-api-tokenController');
var jwt = require('jwt-simple');
var roles = require('../models/const.js').USER_ROLES;
var User = require('../models/user.js');
var config = require('../config');
var response = require('../helpers/response.js');

function _generateToken(user) {
	var token = jwt.encode({
		iss: "betSport-api", // the issuer of the claim
		iat: _issuedAt(), // issued-at time
		exp: _expiresIn(config.jwt_valid_days), // expiration time,
		user_id: user.id
	}, config.jwt_secret, 'HS256');

	return token;
};

module.exports.generateToken = _generateToken;

function _issuedAt() {
	var dateObj = new Date();
	return dateObj.getTime();
};

function _expiresIn(numDays) {
	var dateObj = new Date();
	return dateObj.setDate(dateObj.getDate() + numDays);
};

module.exports.gen_token = function (req, res) {
	res.json(_generateToken({ id: req.params.id }));
};

module.exports.optional = function (req, res, next) {
	return next();
};

module.exports.require = function (req, res, next) {
	return _checkToken(req, res, next);
};

function _checkToken(req, res, next) {
	var token = (req.body && req.body.access_token) ||
		(req.query && req.query.access_token) ||
		req.headers['x-access-token'] ||
		req.headers['authorization'];

	if (token) {
		try {
			var decoded_token = jwt.decode(token, config.jwt_secret, 'HS256');
			if (decoded_token.exp <= Date.now()) {
				return res.status(401).json(response.not_authorized());
			}
			
			// Authorize the user to see if s/he can access our resources
			User.findById(decoded_token.user_id, function (err, user) {
				if (err) {
					debug(err);
					return res.status(500).json(response.error());
				}

				if (user) {
					req.user = user; // assign user to req
					next(); // To move to next middleware

					//req.url.indexOf('/admin/') >= 0 &&
					//if (( user.role === roles.ADMIN) ||
					//	(req.url.indexOf('/admin/') < 0 && req.url.indexOf('/api/v1/') >= 0)) {
                    //
					//	req.user = user; // assign user to req
					//	next(); // To move to next middleware
					//} else {
					//	return res.status(403).json(response.forbidden());
					//}
				}
				else {
					// No user with this name exists, respond back with a 401
					return res.status(401).json(response.not_authorized());
				}
			});

		} catch (err) {
			debug(err);
			return res.status(500).json(response.error());
		}
	} else {
		return res.status(401).json(response.not_authorized());
	}
};

