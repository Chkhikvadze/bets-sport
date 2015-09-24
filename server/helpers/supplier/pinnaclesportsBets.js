/**
 * Created by gigac on 9/18/2015.
 */
var core = require('../core.js');
var logger = require('../logger.js');
var async = require('async');
var request = require('request');

var URLS_Pinnaclesports = [
    {
        url: 'http://www.pinnaclesports.com/webapi/1.14/api/v1/GuestLines/Today/29?callback=angular.callbacks._0',
        tags: ['pinnaclesports']
    }];

module.exports.runPinnaclesports = function (finish) {
    async.eachLimit(URLS_Pinnaclesports, 1, function (urlItem, urlCallback) {

        var j = request.jar();
        var cookie = request.cookie('Language=en_US;UI_Language=en-US');
        j.setCookie(cookie, urlItem.url);
        request({url: urlItem.url, jar: j}, function (error, responce, body) {

            try {
                var jsonString = body.substring(21, body.length - 2)
                var array = JSON.parse(jsonString);

                async.eachLimit(array.Leagues, 1, function (items, callback) {
                    async.eachLimit(items.Events, 1, function (event, callbackMain) {
                        var player1 = "";
                        var player2 = "";

                        var year = event['DateAndTime'].substring(0, 4);
                        var month = event['DateAndTime'].substring(5, 7);
                        var day = event['DateAndTime'].substring(8, 10);
                        var hours = event['DateAndTime'].substring(11, 13);
                        var minutes = event['DateAndTime'].substring(14, 16);
                        var date = new Date(year, month - 1, day, hours - 1 + 12, minutes, 0, 0);


                        var bet1 = "";
                        var betX = "";
                        var bet2 = "";

                        var bets = event['Participants'];
                        if (bets !== undefined && bets.length > 0) {
                            for (var n in bets) {
                                var item = bets[n];
                                if (item !== null && item !== undefined) {
                                    if (item['Type'] === 'Team1') {
                                        player1 = item['Name'];
                                        if (item['MoneyLine'] !== null && item['MoneyLine'] !== undefined) {
                                            var moneyLine = parseFloat(item['MoneyLine']);
                                            if (moneyLine > 0) {
                                                bet1 = ((moneyLine / 100) + 1);
                                            } else {
                                                bet1 = ((100 / moneyLine * 1) + 1);
                                            }
                                        }

                                    } else if (item['Type'] === 'Team2') {
                                        player2 = item['Name'];
                                        if (item['MoneyLine'] !== null && item['MoneyLine'] !== undefined) {
                                            var moneyLine = parseFloat(item['MoneyLine']);
                                            if (moneyLine > 0) {
                                                bet2 = ((moneyLine / 100) + 1);
                                            } else {
                                                bet2 = ((100 / moneyLine * 1) + 1);
                                            }
                                        }
                                    }
                                    else if (item['IsDraw'] === true) {
                                        if (item['MoneyLine'] !== null && item['MoneyLine'] !== undefined) {
                                            var moneyLine = parseFloat(item['MoneyLine']);
                                            if (moneyLine > 0) {
                                                betX = ((moneyLine / 100) + 1);
                                            } else {
                                                betX = ((100 / moneyLine * 1) + 1);
                                            }
                                        }
                                    }
                                }
                            }

                        }
                        if (date === "" ||
                            bet1 === "" ||
                            betX === "" ||
                            bet2 === "") {
                            return callbackMain();
                        }

                        var bet = {
                            betType: "football",
                            bet1: bet1,
                            betX: betX,
                            bet2: bet2,
                            player1: player1,
                            player2: player2,
                            date: date,
                            betSupplier: "pinnacleSports",
                            webSite: 'https://pinnaclesports.com/'
                        };

                        core.saveDataInDatabase(bet, function (err) {
                            console.log("save");
                            callbackMain(err)
                        });
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

            } catch (e) {
                console.log("error");
                console.log(e);
                return finish();
            }
        });
    }, function (err) {
        if (err) {
            logger.log(err);
        }
        finish()
    });
};


module.exports.pinnaclesportsBets = function () {
    var request = require('request'),
        username = "BK813148",
        password = "beqa3!0302",
        url = "https://api.pinnaclesports.com/v1/bets?betlist=settled&fromDate=2015-09-01&toDate=2015-09-28",
        auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

    request(
        {
            url: url,
            headers: {
                "Authorization": auth
            }
        },
        function (error, response, body) {

            console.log(body);
            // Do more stuff with 'body' here
        }
    );
};