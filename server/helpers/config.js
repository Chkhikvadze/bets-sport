/// <reference path="../../typings/node/node.d.ts"/>
var path = require('path');

module.exports = {

	uploadPath: ((process.env.NODE_ENV || 'development') === 'development')
		? path.join(__dirname, "../../front/public/upload/")
		: "/home/dolomedes/front/public/upload/",
	database: ((process.env.NODE_ENV || 'development') === 'development')
		? "mongodb://localhost:27017/dolomedes"
		: "mongodb://vobi:anereizi@178.62.244.43:27017/dolomedes"
};