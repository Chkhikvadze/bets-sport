var response = require('../helpers/response.js');
var Model = require('../models/bet.js');
var mongoose = require('../models/mongoose.js');
var crudController = require('./crudController.js')(Model);
var core = require('../helpers/core.js');
var xbet = require('../helpers/supplier/1xbet.js');
var adjarabet = require('../helpers/supplier/adjarabet.js');
var europa = require('../helpers/supplier/europa.js');
var pinnaclesportsBets = require('../helpers/supplier/pinnaclesportsBets.js');
var liderbet = require('../helpers/supplier/liderbet.js');
var Bet = require('../models/bet.js');


module.exports.list = function (req, res) {
    return crudController.list(req, res);
};

module.exports.getNewBets = function (req, res) {

    Bet.remove({}, function (err) {
        if (err)
        {
            return res.status(400).json(response.bad_request(err.errors));
        }
        xbet.run1xbet(function () {
            console.log("finish 1xbet");

            adjarabet.runAdjarabet(function (err) {
                console.log("finish Adjarabet");

                europa.runEuropabet(function () {
                    console.log("finish Europa");

                    pinnaclesportsBets.runPinnaclesports(function () {
                        console.log("finish pinnaclesportsBets");

                        console.log("Finish Alllllllllllllllllllllllllllllllllllllllllllllllllllllllllll");
                    });
                });
            });
        });
    });

    return res.status(200).json(response.success({}));
};

module.exports.calculateBets = function (req, res) {
    var stake = req.params.stake;
    core.calculateBets(stake, function (list) {
        return res.status(200).json(response.success(list));
    });
};

module.exports.read = crudController.read;
module.exports.delete = crudController.delete;
module.exports.create = crudController.create;
module.exports.update = crudController.update;