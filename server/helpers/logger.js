var winston = require('winston');
require('winston-mongodb').MongoDB;
var config = require('./config');

winston.add(winston.transports.MongoDB, {
	db: config.database,
	storeHost: true,
	handleExceptions: true,
	exitOnError: false
});

module.exports.log = function (err) {
	winston.error(err);
};