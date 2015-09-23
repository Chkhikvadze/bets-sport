
module.exports = {
	jwt_secret: 'vinc gaamxilos ...',
	jwt_valid_days: 1,
	connectionString: function () {
		return 'mongodb://localhost:27017/betSport';
	},
	uploadServerPath: 'http://192.168.100.17:7778/uploads/'
};