/// <reference path="../../typings/node/node.d.ts"/>
'use strict';

var debug = require('debug')('betSport-api-userController');
var request = require('request');
var crypto = require('crypto');
var async = require('async');
var Mailgun = require('mailgun-js');
var os = require('os');
var response = require('../helpers/response.js');
var copyFrom = require('../helpers').copyFrom;
var tokenController = require('./tokenController.js');
var roles = require('../models/const.js').USER_ROLES;
var User = require('../models/user.js');
var crudController = require('./crudController.js')(User);
var mailConfig = require('../config/mail.js');


var _USER_ACTIVATION_CALLBACK_URL = "http://localhost:3000/#activate/";
var _USER_FORGOT_CALLBACK_URL = "http://localhost:3000/#reset/";



function _generateToken(user) {
	var stripUser = user.profile.toJSON();
	stripUser.role = user.role;
	stripUser.email = user.local.email;

	return {
		token: tokenController.generateToken(user),
		user: stripUser
	};
};

module.exports.facebook = function (req, res) {
	if (!req.body.access_token) {
		return res.status(400).json(response.bad_request());
    }

	var me_url = 'https://graph.facebook.com/v2.3/me?fields=location,age_range,address,about,id,email,first_name,gender,last_name,link,locale,name,timezone,updated_time,verified,picture,cover&access_token='
		+ req.body.access_token;
	request.get({ url: me_url, json: true }, function (err, fb_response) {
		var fb_user = fb_response.body;

		// if no user or no permission to email return error
		if (!fb_user || !fb_user.email) {
			return res.status(400).json(response.bad_request());
		}

		// find user by facebook_id or email
		User.findOne()
			.or([{ 'facebook.id': fb_user.id }, { 'local.email': fb_user.email }])
			.exec(function (err, user) {
			if (err) {
				debug(err);
				return res.status(500).json(response.error());
			}

			if (user) { // update existing

			} else { // create new
				user = new User();
			}

			user.facebook.access_token = req.body.access_token;
			// user.facebook.location = fb_user.location;
			user.facebook.age_range.min = fb_user.age_range ? fb_user.age_range.min : undefined;
			// user.facebook.address = fb_user.
			// user.facebook.about = fb_user.
			user.facebook.id = fb_user.id;
			user.facebook.email = fb_user.email;
			user.facebook.first_name = fb_user.first_name;
			user.facebook.gender = fb_user.gender;
			user.facebook.last_name = fb_user.last_name;
			user.facebook.link = fb_user.link;
			user.facebook.locale = fb_user.locale;
			user.facebook.name = fb_user.name;
			user.facebook.timezone = fb_user.timezone;
			user.facebook.updated_time = fb_user.updated_time;
			user.facebook.verified = fb_user.verified;
			user.facebook.picture = fb_user.picture ? fb_user.picture.data.url : undefined;
			user.facebook.cover = fb_user.cover ? fb_user.cover.url : undefined;

			// set email if not local account
			if (!user.local.email) user.local.email = user.facebook.email;
			
			// fill profile if not already set
			if (!user.profile.firstName) user.profile.firstName = user.facebook.first_name;
			if (!user.profile.lastName) user.profile.lastName = user.facebook.last_name;
			// if(!user.profile.country) user.profile.country = user.facebook
			// if(!user.profile.city) user.profile.city = user.facebook
			if (!user.profile.gender && user.facebook.gender) user.profile.gender = user.facebook.gender === 'male' ? 1 : 0;
			// if(!user.profile.about) user.profile.about = user.facebook
			if (!user.profile.avatar) user.profile.avatar = user.facebook.picture;

			user.save(function (err) {
				if (err) {
					debug(err);
					return res.status(500).json(response.error());
				}

				return res.status(200).json(response.success(_generateToken(user)));
			});
		});
	});
};

module.exports.signup = function (req, res) {
	var username = req.body.username || '';
    var password = req.body.password || '';
    var firstName = req.body.firstName || '';
    var lastName = req.body.lastName || '';
	if (username == '' || password == '') {
		return res.status(400).json(response.bad_request());
    }

	User.findOne({ 'local.email': username }, function (err, user) {
		if (err) {
			debug(err);
			return res.status(500).json(response.error());
		}
		if (user) {
			return res.status(409).json(response.conflict("That email is already taken."));
		}
		console.log(password);
		// create the user
		var newUser = new User();
		newUser.local.email = username;
		newUser.local.password = newUser.generateHash(password);
		newUser.profile.isActive = false;
		newUser.profile.firstName = firstName;
		newUser.profile.lastName = lastName;
		newUser.save(function (err) {
			if (err) {
				debug(err);
				return res.status(500).json(response.error());
			}
	
			// send activation
			_sendActivationEmail(req, newUser, function (status, data) {
				// If authentication is success, we will generate a token
				// and dispatch it to the client 
				res.status(200).json(response.success(_generateToken(newUser)));
			});
		});
	});
};

function _sendActivationEmail(req, user, callback) {
	if (process.env == 'testing')
		return callback(200, response.success());
	
	// generate token
	crypto.randomBytes(16, function (err, buf) {
		if (err) {
			debug(err);
			return callback(500, response.error());
		}

		var token = buf.toString('hex');
		
		// send email
		var mailgun = new Mailgun({
			apiKey: mailConfig.mailgun.apiKey,
			domain: mailConfig.mailgun.domain
		});

		var data = {
			from: mailConfig.mailgun.getsupport(),
			to: user.local.email,
			subject: "მომხმარებლის აქტივაცია",
			html: "მადლობთ რეგისტრაციისთვის, " + os.EOL +
			"სერვისით სარგებლობისათვის საჭიროა აქტივაცია, გთხოვთ გადახვიდეთ შემდეგ ბმულზე: " + os.EOL +
			_USER_ACTIVATION_CALLBACK_URL + "?token=" + token + os.EOL +
			"SIGNATURE"
		};
		mailgun.messages().send(data, function (err, body) {
			if (err) {
				debug(err);
				return callback(500, response.error());
			}
			// save token
			user.local.activationToken = token;
			user.save(function (err) {
				if (err) {
					debug(err);
					return callback(500, response.error());
				}

				return callback(200, response.success());
			});
		});
	});
}

module.exports.activate = function (req, res) {
	User.findOne()
		.where('local.activationToken').equals(req.params.token)
		.exec(function (err, user) {
		if (err) {
			debug(err);
			return res.status(500).json(response.error());
		}
		user.profile.isActive = true;
		user.save(function (err) {
			if (err) {
				debug(err);
				return res.status(500).json(response.error());
			}

			res.status(200).json(response.success());
		});
	});
};

module.exports.requestActivate = function (req, res) {
	if (!req.user.local) {
		return res.status(200).json(response.success());
	}

	_sendActivationEmail(req, req.user, function (status, data) {
		return res.status(status).json(data);
	});
};


module.exports.forgot = function (req, res) {
	if (!req.body.username) {
		return res.status(400).json(response.bad_request());
	}

	User.findOne()
		.where('local.email').equals(req.body.username)
		.exec(function (err, user) {

		if (err) {
			debug(err);
			return res.status(500).json(response.error());
		}

		if (!user) {
			return res.status(404).json(response.not_found());
		}

		crypto.randomBytes(16, function (err, buf) {
			var token = buf.toString('hex');
			
			// send email
			var mailgun = new Mailgun({
				apiKey: mailConfig.mailgun.apiKey,
				domain: mailConfig.mailgun.domain
			});

			var data = {
				from: mailConfig.mailgun.getsupport(),
				to: user.local.email,
				subject: "პაროლის აღდგენა",
				html: "პაროლის აღდგენა " + os.EOL +
				"გთხოვთ გადახვიდეთ შემდეგ ბმულზე: " + os.EOL +
				_USER_FORGOT_CALLBACK_URL + "?token=" + token + os.EOL +
				"SIGNATURE"
			};
			mailgun.messages().send(data, function (err, body) {
				if (err) {
					debug(err);
					return res.status(500).json(response.error());
				}
				// save token				
				user.local.resetPasswordToken = token;
				user.local.resetPasswordExpires = Date.now() + 3600000 * 2; // 2 hour
				user.save(function (err) {
					if (err) {
						debug(err);
						return res.status(500).json(response.error());
					}

					return res.status(200).json(response.success());
				});
			});
		});
	});
};

module.exports.reset = function (req, res) {
	if (!req.body.token || !req.body.password) {
		return res.status(400).json(response.bad_request());
	}

	User.findOne()
		.where('local.resetPasswordToken').equals(req.body.token)
		.where('local.resetPasswordExpires').gt(Date.now())
		.exec(function (err, user) {
		if (err) {
			debug(err);
			return res.status(500).json(response.error());
		}

		if (!user) {
			return res.status(404).json(response.not_found());
		}

		user.local.password = user.generateHash(req.body.password);
		user.local.resetPasswordToken = undefined;
		user.local.resetPasswordExpires = undefined;
		user.save(function (err) {
			if (err) {
				debug(err);
				return res.status(500).json(response.error());
			}

			return res.status(200).json(response.success());
		});
	});
};

module.exports.login = function (req, res) {
	var username = req.body.username || '';
    var password = req.body.password || '';
	if (username == '' || password == '') {
		return res.status(401).json(response.not_authorized());
    }

	User.findOne({ 'local.email': username }, function (err, user) {
		if (err) {
			debug(err);
			return res.status(500).json(response.error());
		}

		if (!user || !user.validatePassword(password)) { // If authentication fails, we send a 401 back
			return res.status(401).json(response.not_authorized());
		}
	
		// If authentication is success, we will generate a token
		// and dispatch it to the client 
		res.status(200).json(response.success(_generateToken(user)));
	});
};

module.exports.advertisers = function (req, res) {
	User.find()
		.where('role').equals(roles.ADVERTIZER)
		.select('profile local.email')
		.exec(function (err, users) {
		if (err) {
			debug(err);
			return res.status(500).json(response.error());
		}

		res.status(200).json(response.success(users));
	});
};

module.exports.createAdvertiser = function (req, res) {
	var username = req.body.username || '';
    var password = req.body.password || '';
    var firstName = req.body.firstName || '';
    var lastName = req.body.lastName || '';
	if (username == '' || password == '') {
		return res.status(400).json(response.bad_request());
    }

	User.findOne({ 'local.email': username }, function (err, user) {
		if (err) {
			debug(err);
			return res.status(500).json(response.error());
		}
		if (user) {
			return res.status(409).json(response.conflict("That email is already taken."));
		}
		
		// create the user
		var newUser = new User();
		newUser.local.email = username;
		newUser.local.password = newUser.generateHash(password);
		newUser.profile.isActive = true;
		newUser.profile.firstName = firstName;
		newUser.profile.lastName = lastName;
		newUser.role = roles.ADVERTIZER;
		newUser.save(function (err) {
			if (err) {
				debug(err);
				return res.status(500).json(response.error());
			}

			res.status(200).json(response.success());
		});
	});
};

module.exports.deleteAdvertiser = crudController.delete;