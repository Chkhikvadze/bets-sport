/// <reference path="../../typings/node/node.d.ts"/>
var path = require('path');

module.exports = {
	database: ((process.env.NODE_ENV || 'development') === 'development')
		? "mongodb://localhost:27017/betSport"
		: "mongodb://test:test@localhost:27017/betSport"
};