/**
 * Created by gigac on 9/18/2015.
 */

var core = require('../core.js');
var logger = require('../logger.js');
var async = require('async');
var request = require('request');

var URLS_adjarabet = [
    {
        url: 'https://bookmakers.adjarabet.com/BookmakersAPI/sportsbook/rest/public/leaguesMatches?&ln=en&id=9358&ln=en&id=9357&ln=en&id=9359&ln=en&id=9360&ln=en&id=9361&ln=en&id=9362&ln=en&id=9363&ln=en&id=9364&ln=en&id=9378&ln=en&id=9381&ln=en&id=9382&ln=en&id=9380&ln=en&id=9379&ln=en&id=9386&ln=en&id=9389&ln=en&id=9388&ln=en&id=9387&ln=en&id=9383&ln=en&id=9385&ln=en&id=9384&ln=en&id=4436&ln=en&id=4496&ln=en&id=4494&ln=en&id=2615&ln=en&id=2605&ln=en&id=2883&ln=en&id=2935&ln=en&id=7490&ln=en&id=9546&ln=en&id=2553&ln=en&id=3127&ln=en&id=2968&ln=en&id=3710&ln=en&id=3397&ln=en&id=2845&ln=en&id=2609&ln=en&id=2590&ln=en&id=3016&ln=en&id=2620&ln=en&id=3137&ln=en&id=8970&ln=en&id=8971&ln=en&id=8972&ln=en&id=3008&ln=en&id=2745&ln=en&id=2847&ln=en&id=3210&ln=en&id=7307&ln=en&id=2987&ln=en&id=2807&ln=en&id=2698&ln=en&id=2892&ln=en&id=3022&ln=en&id=2826&ln=en&id=3359&ln=en&id=3361&ln=en&id=3019&ln=en&id=3162&ln=en&id=3164&ln=en&id=3084&ln=en&id=3425&ln=en&id=3426&ln=en&id=3430&ln=en&id=9761&ln=en&id=3342&ln=en&id=6701&ln=en&id=3380&ln=en&id=2618&ln=en&id=3269&ln=en&id=3192&ln=en&id=2558&ln=en&id=2711&ln=en&id=3469&ln=en&id=2677&ln=en&id=3032&ln=en&id=3274&ln=en&id=3383&ln=en&id=3042&ln=en&id=2894&ln=en&id=2896&ln=en&id=3324&ln=en&id=2733&ln=en&id=3030&ln=en&id=57800&ln=en&id=57794&ln=en&id=57795&ln=en&id=2749&ln=en&id=3046&ln=en&id=2901&ln=en&id=3503&ln=en&id=8928&ln=en&id=7493&ln=en&id=7495&ln=en&id=6695&ln=en&id=7013&ln=en&id=3082&ln=en&id=2580&ln=en&id=2783&ln=en&id=2787&ln=en&id=3335&ln=en&id=4101&ln=en&id=3474&ln=en&id=4456&ln=en&id=3203&ln=en&id=2610&ln=en&id=2646&ln=en&id=2653&ln=en&id=8607&ln=en&id=6361&ln=en&id=3749&ln=en&id=2607&ln=en&id=2727&ln=en&id=3232&ln=en&id=3507&ln=en&id=2751&ln=en&id=3066&ln=en&id=2886&ln=en&id=3060&ln=en&id=3076&ln=en&id=3070&ln=en&id=3085&ln=en&id=3536&ln=en&id=2661&ln=en&id=2613&ln=en&id=6369&ln=en&id=3074&ln=en&id=7011&ln=en&id=8474&ln=en&id=2667&ln=en&id=8609&ln=en&id=2945&ln=en&id=3447&ln=en&id=2978&ln=en&id=2597&ln=en&id=3056&ln=en&id=8046&ln=en&id=2989&ln=en&id=7003&ln=en&id=8000&ln=en&id=7065&ln=en&id=2596&ln=en&id=2983&ln=en&id=3824&ln=en&id=3176&ln=en&id=8304&ln=en&id=8936&ln=en&id=7017&ln=en&id=3677&ln=en&id=61007&ln=en&id=9160&ln=en&id=9475&ln=en&id=9063&ln=en&id=9551&ln=en&id=9538&ln=en&id=41707&ln=en&id=7604&ln=en&id=3305',
        tags: ['adjarabet']
    },
    {
        url: 'https://bookmakers.adjarabet.com/BookmakersAPI/sportsbook/rest/public/leaguesMatches?&ln=ka&id=9358&ln=ka&id=9357&ln=ka&id=9359&ln=ka&id=9360&ln=ka&id=9361&ln=ka&id=9362&ln=ka&id=9363&ln=ka&id=9364&ln=ka&id=9378&ln=ka&id=9381&ln=ka&id=9382&ln=ka&id=9380&ln=ka&id=9379&ln=ka&id=9386&ln=ka&id=9389&ln=ka&id=9388&ln=ka&id=9387&ln=ka&id=9383&ln=ka&id=9385&ln=ka&id=9384&ln=ka&id=4436&ln=ka&id=4496&ln=ka&id=4494&ln=ka&id=2615&ln=ka&id=2605&ln=ka&id=2883&ln=ka&id=2935&ln=ka&id=7490&ln=ka&id=9546&ln=ka&id=2553&ln=ka&id=3127&ln=ka&id=2968&ln=ka&id=3710&ln=ka&id=3397&ln=ka&id=2845&ln=ka&id=2609&ln=ka&id=2590&ln=ka&id=3016&ln=ka&id=2620&ln=ka&id=3137&ln=ka&id=8970&ln=ka&id=8971&ln=ka&id=8972&ln=ka&id=3008&ln=ka&id=2745&ln=ka&id=2847&ln=ka&id=3210&ln=ka&id=7307&ln=ka&id=2987&ln=ka&id=2807&ln=ka&id=2698&ln=ka&id=2892&ln=ka&id=3022&ln=ka&id=2826&ln=ka&id=3359&ln=ka&id=3361&ln=ka&id=3019&ln=ka&id=3162&ln=ka&id=3164&ln=ka&id=3084&ln=ka&id=3425&ln=ka&id=3426&ln=ka&id=3430&ln=ka&id=9761&ln=ka&id=3342&ln=ka&id=6701&ln=ka&id=3380&ln=ka&id=2618&ln=ka&id=3269&ln=ka&id=3192&ln=ka&id=2558&ln=ka&id=2711&ln=ka&id=3469&ln=ka&id=2677&ln=ka&id=3032&ln=ka&id=3274&ln=ka&id=3383&ln=ka&id=3042&ln=ka&id=2894&ln=ka&id=2896&ln=ka&id=3324&ln=ka&id=2733&ln=ka&id=3030&ln=ka&id=57800&ln=ka&id=57794&ln=ka&id=57795&ln=ka&id=2749&ln=ka&id=3046&ln=ka&id=2901&ln=ka&id=3503&ln=ka&id=8928&ln=ka&id=7493&ln=ka&id=7495&ln=ka&id=6695&ln=ka&id=7013&ln=ka&id=3082&ln=ka&id=2580&ln=ka&id=2783&ln=ka&id=2787&ln=ka&id=3335&ln=ka&id=4101&ln=ka&id=3474&ln=ka&id=4456&ln=ka&id=3203&ln=ka&id=2610&ln=ka&id=2646&ln=ka&id=2653&ln=ka&id=8607&ln=ka&id=6361&ln=ka&id=3749&ln=ka&id=2607&ln=ka&id=2727&ln=ka&id=3232&ln=ka&id=3507&ln=ka&id=2751&ln=ka&id=3066&ln=ka&id=2886&ln=ka&id=3060&ln=ka&id=3076&ln=ka&id=3070&ln=ka&id=3085&ln=ka&id=3536&ln=ka&id=2661&ln=ka&id=2613&ln=ka&id=6369&ln=ka&id=3074&ln=ka&id=7011&ln=ka&id=8474&ln=ka&id=2667&ln=ka&id=8609&ln=ka&id=2945&ln=ka&id=3447&ln=ka&id=2978&ln=ka&id=2597&ln=ka&id=3056&ln=ka&id=8046&ln=ka&id=2989&ln=ka&id=7003&ln=ka&id=8000&ln=ka&id=7065&ln=ka&id=2596&ln=ka&id=2983&ln=ka&id=3824&ln=ka&id=3176&ln=ka&id=8304&ln=ka&id=8936&ln=ka&id=7017&ln=ka&id=3677&ln=ka&id=61007&ln=ka&id=9160&ln=ka&id=9475&ln=ka&id=9063&ln=ka&id=9551&ln=ka&id=9538&ln=ka&id=41707&ln=ka&id=7604&ln=ka&id=3305',
        tags: ['adjarabet']
    }];

module.exports.runAdjarabet = function (finish) {
    async.eachLimit(URLS_adjarabet, 1, function (urlItem, urlCallback) {

        var j = request.jar();
        var cookie = request.cookie('Language=en_US;UI_Language=en-US');
        j.setCookie(cookie, urlItem.url);
        request({url: urlItem.url, jar: j}, function (error, responce, body) {

            var array = JSON.parse(body);
            async.eachLimit(array, 1, function (items, callback) {

                async.eachLimit(items, 1, function (item, callbackMain) {
                    try {
                        var player1 = item['h'];
                        var player2 = item['a'];
                        var date = new Date(item['sd']);

                        var bet1 = "";
                        var betX = "";
                        var bet2 = "";


                        var bet = item['t']['0-10'];
                        if (bet !== undefined && bet.length > 0) {
                            if (bet[0] !== null && bet[0] !== undefined) {
                                if (bet[0]['n'].toString() === '2') {
                                    bet2 = bet[0]['v'];
                                } else if (bet[0]['n'].toString() === '1') {
                                    bet1 = bet[0]['v'];
                                }
                                else if (bet[0]['n'].toString() === 'X') {
                                    betX = bet[0]['v'];
                                }
                            }

                            if (bet[1] !== null && bet[1] !== undefined) {
                                if (bet[1]['n'].toString() === '2') {
                                    bet2 = bet[1]['v'];
                                } else if (bet[1]['n'].toString() === '1') {
                                    bet1 = bet[1]['v'];
                                }
                                else if (bet[1]['n'].toString() === 'X') {
                                    betX = bet[1]['v'];
                                }
                            }

                            if (bet[2] !== null && bet[2] !== undefined) {
                                if (bet[2]['n'].toString() === '2') {
                                    bet2 = bet[2]['v'];
                                } else if (bet[2]['n'].toString() === '1') {
                                    bet1 = bet[2]['v'];
                                }
                                else if (bet[2]['n'].toString() === 'X') {
                                    betX = bet[2]['v'];
                                }
                            }
                        }

                        if (date === "" ||
                            bet1 === "" ||
                            betX === "" ||
                            bet2 === "") {
                            callbackMain();
                            return;
                        }


                        var bet = {
                            betType: "football",
                            bet1: bet1,
                            betX: betX,
                            bet2: bet2,
                            player1: player1,
                            player2: player2,
                            date: date,
                            betSupplier: "adjaraBet",
                            webSite: 'https://adjarabet.com'
                        };

                        core.saveDataInDatabase(bet, function (err) {
                            callbackMain(err);
                        });
                    } catch (e) {
                        console.log(e);
                        callbackMain(e);
                        return;
                    }
                }, function (err) {
                    if (err) {
                        logger.log(err);
                    }
                    callback(err);
                });
            }, function (err) {
                if (err) {
                    logger.log(err);
                }
                urlCallback(err);
            });
        });

    }, function (err) {
        if (err) {
            logger.log(err);
        }
        finish(err);
    });
};