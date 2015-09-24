var request = require('request');
var fs = require('fs');
var Chance = require('chance');
var config = require('./config');

var error = function (message) {
    console.log(message);
};

var randStr = function (len) {

    var chance = new Chance();
    chance = chance.string({ length: len || 10, pool: '1234567890qwertyuiopasdfghjklzxcvbnm' });
    return chance;
};

var randImageName = function () {

    return randStr(20) + ".jpg";
};


Number.prototype.padLeft = function (base, chr) {
    var len = (String(base || 10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join(chr || '0') + this : this;
}

module.exports = {
    dateToString : function (d) {

        var dformat = [d.getDate().padLeft(),
                (d.getMonth() + 1).padLeft(),
                d.getFullYear()].join('/') + ' ' +
            [d.getHours().padLeft(),
                d.getMinutes().padLeft(),
                d.getSeconds().padLeft()].join(':');
        return dformat;
    },

    download: function (uri, filename, callback) {

        request.head(uri, function (err, res, body) {
            var r = request(uri).pipe(fs.createWriteStream(config.uploadPath + filename));
            r.on('close', callback);
            r.on('error', error);
        });
    },

    randStr: randStr,
    randImageName: randImageName,
};

