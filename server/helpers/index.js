


module.exports.copyFrom = function (source, destination) {
	for (var prop in source) {
//		if (destination.hasOwnProperty(prop)) {
			destination[prop] = source[prop];
//		}
	}
};