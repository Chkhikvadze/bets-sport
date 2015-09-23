

module.exports.response = function (status, message, data) {
	var res = {};
	res.status = status;
	if (message) res.message = message;
	res.data = data || {};

	return res;
};

module.exports.success = function (data) {
	return this.response(200, "", data);
};

module.exports.error = function (status) {
	return this.response(500, "Oops something went wrong");
};

module.exports.not_found = function () {
	return this.response(404, "Not Found");
};

module.exports.not_authorized = function () {
	return this.response(401, "Not Authorized");
};

module.exports.forbidden = function () {
	return this.response(403, "Forbidden");
};

module.exports.conflict = function (message) {
	return this.response(409, message);
};

module.exports.bad_request = function (message) {
	return this.response(400, message);
};