
module.exports.mailgun = {
	//Your api key, from Mailgun’s Control Panel
	apiKey: 'key-3b4f538196b2d3c9a69723e03d45ab27',
	//Your domain, from the Mailgun Control Panel
	domain: 'sandbox6a9664debf1b4bc6a15d95822344a930.mailgun.org',
	//Your sending email address
	support: 'support@betSport.com',
	noreply: 'noreply@betSport.com',
	invoice: 'invoice@betSport.com',
	defaultFrom: 'Invoice ',
	getnoreply: function (email) {
		return (email || this.defaultFrom) + " <" + this.noreply + ">";
	},
	getsupport: function () {
		return "betSport.com Team <" + this.support + ">";
	},
	getinvoice: function (email) {
		return (email || this.defaultFrom) + " <" + this.invoice + ">";
	}
};