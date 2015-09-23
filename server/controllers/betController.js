var response = require('../helpers/response.js');
var Model = require('../models/bet.js');
var mongoose = require('../models/mongoose.js');
var crudController = require('./crudController.js')(Model);
var core = require('../helpers/core.js');
var xbet = require('../supplier/1xbet.js');
var adjarabet = require('../supplier/adjarabet.js');
var europa = require('../supplier/europa.js');
var pinnaclesportsBets = require('../supplier/pinnaclesportsBets.js');
var liderbet = require('../supplier/liderbet.js');


module.exports.list = function (req, res) {
    return crudController.list(req, res);
};

module.exports.getNewBets = function (req, res) {

    //liderbet.run(function () {
    //    console.log("Liderbet Finish");
    //});

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