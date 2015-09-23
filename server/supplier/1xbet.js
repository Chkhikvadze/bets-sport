/**
 * Created by gigac on 9/18/2015.
 */

var core = require('../helpers/core.js');
var logger = require('../helpers/logger.js');
var async = require('async');
var request = require('request');

//region 1xbet
var URLS_1xbet = [
    {
        url: 'https://1xbet.com/LineFeed/Get1x2?sportId=1&sports=&count=10000&cnt=10&lng=ka&cfview=0',
        tags: ['1xbet']
    }];

module.exports.run1xbet = function (finish) {
    async.eachLimit(URLS_1xbet, 1, function (urlItem, urlCallback) {

        var j = request.jar();
        var cookie = request.cookie('Language=en_US;UI_Language=en-US');
        j.setCookie(cookie, urlItem.url);
        request({url: urlItem.url, jar: j}, function (error, responce, body) {

            var array = JSON.parse(body);

            async.eachLimit(array.Value, 1, function (item, callback) {

                try {
                    if (item["ChampEng"] !== null && item["ChampEng"] !== undefined) {
                        if (item["ChampEng"].indexOf("Alternative Matches.") > -1) {
                            callback();
                            return;
                        }
                    }
                    var player1 = item['Opp1Eng'];
                    var player2 = item['Opp2Eng'];
                    var player1Tag = item['Opp1'];
                    var player2Tag = item['Opp2'];

                    var date = (new Date(item['Start'] * 1000));
                    var bet1 = "";
                    var betX = "";
                    var bet2 = "";


                    async.eachLimit(item.Events, 1, function (event, callbackEvent) {

                        if (event['T'] === 1)
                            bet1 = event['C'];
                        else if (event['T'] === 2)
                            betX = event['C'];
                        else if (event['T'] === 3)
                            bet2 = event['C'];
                        callbackEvent();

                    }, function (err) {
                        if (err) {
                            logger.log(err);
                        }

                        if (date === "" ||
                            bet1 === "" ||
                            betX === "" ||
                            bet2 === "") {
                            callback();
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
                            betSupplier: "1xbet",
                            webSite: 'https://1xbet.com',
                            player1Tag: player1Tag,
                            player2Tag: player2Tag
                        };

                        core.saveDataInDatabase(bet, function (err) {
                            callback(err);
                        });
                    });
                } catch (e) {
                    console.log(e);
                    callback(e);
                    return;
                }
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
//endregion 1xbet


//var URLS_1xbet = [
//    {
//        url: 'https://1xbet.com/en/line/Football/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/88637-England-Premier-League/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/12821-France-Ligue-1/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/96463-Germany-Bundesliga/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/110163-Italy-Serie-A/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/118657-Russia-Premier-League/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/127733-Spain-Primera-Divisin/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/898825-UEFA-Euro-2016-Qualifiers/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/61895-FIFA-World-Cup-Qualification/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/118587-UEFA-Champions-League/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/118593-UEFA-Europa-League/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/119575-Netherlands-Eredivisie/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/118663-Portugal-Portuguese-Liga/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/13521-Scotland-Premier-League/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/119599-Argentina-Primera-Division/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/28787-Belgium-Jupiler-League/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/8773-Denmark-Superliga/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/105759-England-Championship/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/109313-Germany-2-Bundesliga/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/118737-Japan-J-League/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/37087-Norway-Tippeligaen/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/178029-Sweden-Allsvenskan/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/27695-Switzerland-SuperLeague/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/118589-USA-MLS/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/92003-Brazil-Campeonato-Brasileiro/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/67559-Club-Friendlies/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/27707-Czech-Republic-Gambrinus-Liga/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/27707-Czech-Republic-Gambrinus-Liga/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/12829-France-Ligue-2/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/120507-Mexico-Primera-Division/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/27731-Poland-Ekstraklasa/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/118585-Russian-Championship-FNL/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/11113-Turkey-SuperLiga/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/1072453-2017-UEFA-Euro-Qualification/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/28645-Algeria-Ligue-1/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/887299-Argentina-Primera-B-Nacional/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/67487-Argentina-Reserve-League/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/104509-Australia-A-League/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/976179-Australia-FFA-Cup/',
//        tags: ['1xbet']
//    },
//    {
//        url: 'https://1xbet.com/en/line/Football/1072579-Australia-National-Premier-Leagues/',
//        tags: ['1xbet']
//    }];
//
//var spider_1xbet = {
//    urls: URLS_1xbet,
//    processBody: function (body) {
//        var $ = cheerio.load(body);
//        return $('.tb2');
//    },
//    processItem: function (html, url, tags) {
//
//        try {
//            var $ = cheerio.load(html);
//            var date = $('.score').text().trim();
//            var teams = $('.name').children('a').children('span').text().trim();
//            var index = teams.indexOf(String.fromCharCode(8212)); // split symbol teams
//
//            var Team1 = "";
//            var Team2 = "";
//            if (index>-1) {
//                Team1 = teams.substring(0, index - 1).trim();
//                Team2 = teams.substring(index + 1, teams.length).trim();
//            }
//            //
//            var bet1 = $('.hot_table_bet a div')[0].attribs['data-coef'];
//            var betX = $('.hot_table_bet a div')[1].attribs['data-coef'];
//            var bet2 = $('.hot_table_bet a div')[2].attribs['data-coef'];
//
//
//            if (date === "" ||
//                bet1 === "" ||
//                betX === "" ||
//                bet2 === "" ||
//                Team1 === "" ||
//                Team2 === "") {
//                return {};
//            }
//
//
//            var year = (new Date()).getFullYear();
//            var month = date.substring(3, 5);
//            var day = date.substring(0, 2);
//            var hours = date.substring(8, 10);
//            var minutes = date.substring(11, 13);
//            var dt = new Date(year, month - 1, day, hours, minutes, 0, 0);
//            return {
//                betType: "football",
//                bet1: bet1,
//                betX: betX,
//                bet2: bet2,
//                player1: Team1,
//                player2: Team2,
//                date: dt,
//                betSupplier: "1xbet",
//                webSite: 'https://1xbet.com'
//            }
//
//        }
//        catch (e) {
//            console.log("parse error:");
//            console.log(e);
//            return {};
//        };
//    },
//    finish: function () {
//        console.log('Finished');
//    }
//
//};
//
//module.exports.run1xbet = function () {
//    this.run(spider_1xbet);
//};