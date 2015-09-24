/**
 * Created by gigac on 9/18/2015.
 */
var core = require('../core.js');
var logger = require('../logger.js');
var async = require('async');
var request = require('request');
var cheerio = require('cheerio');

var URLS_Europa = [
    {
        url: 'https://sport.europe-bet.com/Odds/bets/date/24H',
        tags: ['europe-bet'],
        cookie : 'Language=en_US;UI_Language=en-US'
    }];

var spider_Europa = {
    urls: URLS_Europa,
    processBody: function (body) {
        var $ = cheerio.load(body);
        return $('.category_bets');
    },
    processItem: function (html, url, tags) {

        try {
            var $ = cheerio.load(html);


            var date = $('#betDateText').text();
            var time = $('#betHourText').text();

            var teams = $('#categoryText').text().trim();
            var index = teams.indexOf('-');
            var Team1 = teams.substring(0, index - 1).trim();
            var Team2 = teams.substring(index + 1, teams.length).trim();

            var bet1 = $('td.category_outcome p.eoo_p')[0].children[0].data;
            var betX = $('td.category_outcome p.eoo_p')[1].children[0].data;
            var bet2 = $('td.category_outcome p.eoo_p')[2].children[0].data;

            if (date === "" ||
                time === "" ||
                bet1 === "" ||
                betX === "" ||
                bet2 === "") {
                return {};
            }


            var year = "20" + date.substring(6, 8);
            var month = date.substring(3, 5);
            var day = date.substring(0, 2);
            var hours = time.substring(0, 2);
            var minutes = time.substring(3, 5);
            var dt = new Date(year, month - 1, day, hours, minutes, 0, 0);
            return {
                betType: "football",
                bet1: bet1,
                betX: betX,
                bet2: bet2,
                player1: Team1,
                player2: Team2,
                date: dt,
                betSupplier: "europeBet",
                webSite: 'https://sport.europe-bet.com'
            }

        }
        catch (e) {
            console.log("entering catch block");
            console.log(e);
            console.log("leaving catch block");
            return {};
        };
    },
    finish: function () {
        console.log('Finished');
    }

};

module.exports.runEuropabet = function (finish) {
    core.run(spider_Europa, function(){
        finish();
    });
};

