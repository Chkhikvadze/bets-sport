var request = require('request');
var fs = require('fs');
var Chance = require('chance');
var config = require('./config');

var mapObj = {
    ა: "a",
    ბ: "b",
    გ: "g",
    დ: "d",
    ე: "e",
    ვ: "v",
    ზ: "z",
    თ: "t",
    ი: "i",
    კ: "k",
    ლ: "l",
    მ: "m",
    ნ: "n",
    ო: "o",
    პ: "p",
    ჟ: "j",
    რ: "r",
    ს: "s",
    ტ: "t",
    უ: "u",
    ფ: "f",
    ქ: "q",
    ღ: "gh",
    ყ: "y",
    შ: "sh",
    ჩ: "ch",
    ც: "c",
    ძ: "dz",
    წ: "w",
    ჭ: "tc",
    ხ: "x",
    ჯ: "j",
    ჰ: "h",
    ' ': "-",
    ',': "",
    '.': "",
    "/": "",
    '(': "",
    ')': "",
    '#': "",

};


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

    removeImageStyle: function (str) {

        str = str.replace("background-image:url(", "");
        str = str.replace("); display:block;", "");

        return str;
    },

    removeImageStyle2: function (str) {

        str = str.replace("background-image:url('", "");
        str = str.replace("')", "");

        return str;
    },

    removeSize: function (str) {
        return str.replace(/(\d)+x(\d)+/, "");
    },

    removeThumb: function (str) {

        str = str.replace("thumb_", "");
        return str;
    },

    mapUrl: function (title) {

        var url = title.replace(/ა|ბ|გ|დ|ე|ვ|ზ|თ|ი|კ|ლ|მ|ნ|ო|პ|ჟ|რ|ს|ტ|უ|ფ|ქ|ღ|ყ|შ|ჩ|ც|ძ|წ|ჭ|ხ|ჯ|ჰ|,|\/|\#|\(|\)|\.|\s/gi, function (matched) {
            return mapObj[matched];
        });

        return url.replace(/\W+/g, "-");
    },

    download: function (uri, filename, callback) {

        request.head(uri, function (err, res, body) {

            //console.log('content-type:', res.headers['content-type']);
            //console.log('content-length:', res.headers['content-length']);

            var r = request(uri).pipe(fs.createWriteStream(config.uploadPath + filename));
            r.on('close', callback);
            r.on('error', error);
        });
    },

    randStr: randStr,
    randImageName: randImageName,

    currentTimeSTamp: function () {

        return new Date().getTime();

    },

    currentDate: function () {

        return new Date();
    },

    text_in_between: function (source, start, end, include_start, include_end) {
        var start_index = source.indexOf(start);
        var end_index = source.indexOf(end, start_index);
        if (start_index !== -1 && end_index !== -1)
            return source.substring(start_index + (include_start ? 0 : start.length),
                end_index + (include_end ? end.length : 0));
    }
};

