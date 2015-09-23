'use strict';

var debug = require('debug')('betSport-api-profileController');
var response = require('../helpers/response.js');
var copyFrom = require('../helpers').copyFrom;
var User = require('../models/user.js');
var config = require('../config/index.js');

module.exports.update = function (req, res) {
	req.user.profile.set(req.body);
	copyFrom(req.body, req.user.profile);
	if (req.files.avatar)
		req.user.profile.avatar = config.uploadServerPath + req.files.avatar.name;
	req.user.save(function (err) {
		return res.status(200).json(response.success(req.user.profile));
	});
};

module.exports.read = function (req, res) {
	if (req.params.userId) {
		User.findById(req.params.userId, function (err, user) {
			if (err) {
				debug(err);
				return res.status(500).json(response.error());
			}
			if (!user) {
				return res.status(404).json(response.not_found());
			}
			return res.status(200).json(response.success(user.profile));
		});
	} else {
		return res.status(200).json(response.success(req.user.profile));
	}
};

module.exports.deleteAvatar = function (req, res) {
	req.user.profile.avatar = null;
	req.user.save(function (err) {
		return res.status(200).json(response.success(req.user.profile));
	});
};