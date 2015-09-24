/// <reference path="../../typings/express/express.d.ts"/>
"use strict";


var express = require('express');
var response = require('../helpers/response.js');
var tokenController = require('../controllers/tokenController.js');
var userController = require('../controllers/userController.js');
var betController = require('../controllers/betController.js');
var crudGenerator = require('./crud.js');


var router = express.Router();


module.exports = function (app) {

    if (app.get('env') === 'development') {
        router.get('/token/:id', tokenController.gen_token);
    }

    router.all('/*', function (req, res, next) {
        req.request_ip = (req.headers["X-Forwarded-For"] ||
        req.headers["x-forwarded-for"] ||
        req.client.remoteAddress);
        next();
    });

    //define client api routes [BEGIN]
    ///////////////////////////////////////////////

    router.post('/api/v1/user/login/', userController.login);
    router.post('/api/v1/user/login/social/facebook/', userController.facebook);
    router.post('/api/v1/user/signup/', userController.signup);
    router.post('/api/v1/user/activate/', tokenController.require, userController.requestActivate);
    router.get('/api/v1/user/activate/:token', userController.activate);
    router.post('/api/v1/user/forgot/', userController.forgot);
    router.post('/api/v1/user/reset/', userController.reset);


    router.use('/api/v1/bet/', tokenController.require, crudGenerator.controller(require('../controllers/betController.js')));
    router.route('/api/v1/bet/getNewBets/:site').get(tokenController.require, betController.getNewBets);
    router.route('/api/v1/bet/calculateBets/:stake').get(tokenController.require, betController.calculateBets);

    return router;
};