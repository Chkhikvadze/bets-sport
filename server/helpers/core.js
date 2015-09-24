var request = require('request');
var async = require('async');
var logger = require('./logger');
var Model = require('../models/bet.js');
var mongoose = require('../models/mongoose.js');
var cheerio = require('cheerio');
var helper = require('./helpers.js');
var core = require('./core.js');


module.exports.saveDataInDatabase = function (item, callback) {
    try {
        if (item.betType === undefined || item.betType === "" ||
            item.player1 === undefined || item.player1 === "" ||
            item.player2 === undefined || item.player2 === "" ||
            item.date === undefined || item.date === "" ||
            item.bet1 === undefined || item.bet1 === "" ||
            item.bet2 === undefined || item.bet2 === "" ||
            item.betX === undefined || item.betX === "" ||
            item.betSupplier === undefined || item.betSupplier === "" ||
            item.webSite === undefined || item.webSite === "") {
            callback();
            return;
        }

        var dtSt = helper.dateToString(item.date);
        var where = {
                $and: [
                    {betType: item.betType},
                    {date: dtSt},
                    {
                        $or: [
                            {
                                player1Tag: {
                                    "$in": [item.player1Tag]
                                }
                            },
                            {
                                player1Tag: {
                                    "$in": [item.player1]
                                }
                            },
                            {
                                player2Tag: {
                                    "$in": [item.player2Tag]
                                }
                            },
                            {
                                player2Tag: {
                                    "$in": [item.player2]
                                }
                            }
                        ]
                    }
                ]
            }
            ;

        Model.findOne(where, function (err, doc) {
                if (err) {
                    console.log(err);
                    callback();
                    return;
                }
                ;



                var betSupplier = {
                    supplierName: item.betSupplier,
                    webSite: item.webSite,
                    bet1: item.bet1,
                    betX: item.betX,
                    bet2: item.bet2,
                };

                if (doc !== null) {

                    var index = -1;
                    for (var i = 0, len = doc.betSuppliers.length; i < len; i++) {
                        if (doc.betSuppliers[i].supplierName === betSupplier.supplierName) {
                            index = i;
                            break;
                        }
                    }

                    if (index === -1) {
                        doc.betSuppliers.push(betSupplier);
                    }
                    else {
                        doc.betSuppliers[index] = betSupplier;
                    }

                    if (item.player1Tag !== undefined && item.player1Tag !== null && item.player1Tag !== "") {
                        var tagIndex = -1;
                        for (var i = 0, len = doc.player1Tag.length; i < len; i++) {
                            if (doc.player1Tag[i] === item.player1Tag) {
                                tagIndex = i;
                                break;
                            }
                        }
                        if (tagIndex === -1) {
                            doc.player1Tag.push(item.player1Tag);
                        }
                    }
                    if (item.player2Tag !== undefined && item.player2Tag !== null && item.player2Tag !== "") {
                        var tagIndex = -1;
                        for (var i = 0, len = doc.player2Tag.length; i < len; i++) {
                            if (doc.player2Tag[i] === item.player2Tag) {
                                tagIndex = i;
                                break;
                            }
                        }
                        if (tagIndex === -1) {
                            doc.player2Tag.push(item.player2Tag);
                        }
                    }
                    doc.set(doc);
                } else {
                    doc = new Model({
                        betType: item.betType,
                        player1: item.player1,
                        player2: item.player2,
                        date: dtSt,
                        player1Tag: [],
                        player2Tag: [],
                        betSuppliers: []
                    });
                    if (item.player1Tag !== undefined && item.player1Tag !== null && item.player1Tag !== "") {
                        doc.player1Tag.push(item.player1Tag);
                    }
                    if (item.player2Tag !== undefined && item.player2Tag !== null && item.player2Tag !== "") {
                        doc.player2Tag.push(item.player2Tag);
                    }
                    doc.betSuppliers.push(betSupplier);
                }

                var tagIndex = -1;
                for (var i = 0, len = doc.player1Tag.length; i < len; i++) {
                    if (doc.player1Tag[i] === item.player1) {
                        tagIndex = i;
                        break;
                    }
                }
                if (tagIndex === -1) {
                    doc.player1Tag.push(item.player1);
                }

                var tagIndex = -1;
                for (var i = 0, len = doc.player2Tag.length; i < len; i++) {
                    if (doc.player2Tag[i] === item.player2) {
                        tagIndex = i;
                        break;
                    }
                }
                if (tagIndex === -1) {
                    doc.player2Tag.push(item.player2);
                }

                doc.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                    callback(err);
                });
            }
        )
        ;
    }
    catch
        (e) {
        console.log(e);
        returncallback();
    }
}

module.exports.calculateBets = function (stake, callback) {
    Model.find({$where: 'this.betSuppliers.length>1'}, function (err, docs) {
        var list = [];
        try {
            for (var index = 0; index < docs.length; index++) {
                var game = docs[index];

                for (var x = 0; x < game.betSuppliers.length; x++) {
                    for (var y = x + 1; y < game.betSuppliers.length; y++) {
                        var bet1 = game.betSuppliers[x];
                        var bet2 = game.betSuppliers[y];

                        var result1 = calculateBet(bet1.bet1, bet2.betX, bet2.bet2, stake);

                        var result2 = calculateBet(bet2.bet1, bet1.betX, bet1.bet2, stake);


                        if (result1.profitPercent > 0) {
                            result1["player1"] = game.player1;
                            result1["player2"] = game.player2;
                            result1["date"] = game.date;
                            result1["site"] = "1 - " + bet1.supplierName + "; x -" + bet2.supplierName + "; 2 - " + bet2.supplierName;
                            result1["BetRange"] = "1 - " + bet1.bet1 + "; x -" + bet2.betX + "; 2 - " + bet2.bet2;
                            list.push(result1);
                        }

                        if (result2.profitPercent > 0) {
                            result2["player1"] = game.player1;
                            result2["player2"] = game.player2;
                            result2["date"] = game.date;
                            result2["site"] = "1 - " + bet2.supplierName + "; x -" + bet1.supplierName + "; 2 - " + bet1.supplierName;
                            result2["BetRange"] = "1 - " + bet2.bet1 + "; x -" + bet1.betX + "; 2 - " + bet1.bet2;
                            list.push(result2);
                        }
                    }
                }
            }
        } catch (e) {
            console.log("Error:");
            console.log(e);
        }
        callback(list);
    });
};

function calculateBet(bet1, bet2, betX, stake) {
    var percentBet1 = 1 / bet1 * 100;
    var percentBet2 = 1 / bet2 * 100;
    var percentBetX = 1 / betX * 100;

    var totalPercent = percentBet1 + percentBet2 + percentBetX;

    var profitPayment = stake * 100 / totalPercent - stake;
    var profitPercent = profitPayment * 100 / stake;


    var bet1Payment = (stake * percentBet1 / 100) * 100 / totalPercent;
    var bet2Payment = (stake * percentBet2 / 100) * 100 / totalPercent;
    var betXPayment = (stake * percentBetX / 100) * 100 / totalPercent;


    var result = {
        profitPayment: profitPayment,
        profitPercent: profitPercent,
        bet1Payment: bet1Payment,
        bet2Payment: bet2Payment,
        betXPayment: betXPayment,
    }

    return result;
}

module.exports.run = function (spider, finish) {
    async.eachLimit(spider.urls, 1, function (urlItem, urlCallback) {
        var j = request.jar();
        var cookie = request.cookie(urlItem.cookie);
        j.setCookie(cookie, urlItem.url);
        request({url: urlItem.url, jar: j}, function (error, responce, body) {

            async.eachLimit(spider.processBody(body), 1, function (html, callback) {

                var element = spider.processItem(html, urlItem.url, urlItem.tags);
                if (!element || element === {}) return callback();

                async.waterfall([
                    function (done) { // save to db
                        core.saveDataInDatabase(element, function (err) {
                            done(err);
                        });
                    }
                ], function (err, result) {
                    if (err) {
                        logger.log(err);
                    }
                    callback();
                });
            }, function (err) {
                if (err) {
                    logger.log(err);
                }
                urlCallback();
            });

        });

    }, function (err) {
        if (err) {
            logger.log(err);
        }
        finish(err);
    });

};











