/// <reference path="../typings/node/node.d.ts"/>
"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var response = require('./helpers/response.js');
var crypto = require('crypto');
var fs = require('fs');
var debug = require('debug')('betSport-api');


var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));


app.all('/*', function (req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Authorization, Content-type, Accept, X-Access-Token, X-Key');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});


// connect to database
var dbConfig = require('./config');
var mongoose = require('mongoose');
mongoose.connect(dbConfig.connectionString());
mongoose.set('debug', app.get('env') === 'development');

// define routes in routes/index.js
app.use('/', require('./routes/')(app));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
    // test
});
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        console.log(err.message + err.stack);
        debug(err.message + err.stack);
        res.status(err.status || 500).json(response.response(err.status || 500, err.message + err.stack));
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    console.log(err.message + err.stack);
    res.status(err.status || 500).json(response.response(err.status || 500, err.message));
});


module.exports = app;
