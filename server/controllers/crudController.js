/// <reference path="../../typings/mongoose/mongoose.d.ts"/>
'use strict';

var response = require('../helpers/response.js');
var config = require('../config/index.js');
var debug = require('debug')('betSport-api-crudController');

module.exports = function (Model) {
    return {
        list: function (req, res) {
            // TODO use qury params like filter, skip, limit, etc.
            var query = Model.find();

            if (req.query.skip && !isNaN(req.query.skip)) {
                query.skip(req.query.skip);
            }

            if (req.query.limit && !isNaN(req.query.limit)) {
                query.limit(req.query.limit);
            }

            if (req.query.where) {

                var where = JSON.parse(req.query.where);

                if (req.byUser) {
                    where['docInfo.user'] = req.user._id;
                }

                query.where(where)
            }

            if (req.query.select) {
                var select = JSON.parse(req.query.select);
                query.select(select);
            }


            query.exec(function (err, items) {
                if (err) {
                    debug(err);
                    return res.status(500).json(response.error());
                }

                return res.status(200).json(response.success(items));
            });
        },

        create: function (req, res) {

            var item = new Model(req.body);
            if (req.user) {
                item.docInfo.user = req.user;
            }

            // assign files
            for (var key in req.files) {
                var folder = "";
                if (req !== undefined && req.query !== undefined && req.query.folder !== undefined) {
                    folder = req.query.folder + '/';
                }
                item[key] = config.uploadServerPath + folder + req.files[key].name; // temp
            }
            item.save(function (err, item) {
                if (err) {
                    debug(err);
                    // TODO strip unnecassary fields
                    return res.status(400).json(response.bad_request(err.errors));
                }

                return res.status(200).json(response.success(item));
            });
        },

        read: function (req, res) {
            Model.findById(req.params.id, function (err, item) {
                if (err) {
                    debug(err);
                    return res.status(500).json(response.error());
                }

                if (!item) {
                    return res.status(404).json(response.not_found());
                }

                return res.status(200).json(response.success(item));
            });
        },

        update: function (req, res) {
            Model.findById(req.params.id, function (err, item) {
                if (err) {
                    debug(err);
                    return res.status(500).json(response.error());
                }

                if (!item) {
                    return res.status(404).json(response.not_found());
                }

                item.set(req.body);

                // assign files
                for (var key in req.files) {
                    var folder = "";
                    if (req !== undefined && req.query !== undefined && req.query.folder !== undefined) {
                        folder = req.query.folder + '/';
                    }
                    item[key] = config.uploadServerPath + folder + req.files[key].name; // temp
                }
                item.save(function (err, item) {
                    if (err) {
                        debug(err);
                        // TODO strip unnecassary fields from error
                        return res.status(400).json(response.bad_request(err.errors));
                    }

                    return res.status(200).json(response.success(item));
                });
            });
        },

        delete: function (req, res) {
            Model.findById(req.params.id, function (err, item) {
                if (err) {
                    debug(err);
                    return res.status(500).json(response.error());
                }

                if (!item) {
                    return res.status(404).json(response.not_found());
                }

                item.remove(function (err) {
                    if (err) {
                        debug(err);
                        // TODO strip unnecassary fields
                        return res.status(400).json(response.bad_request(err.errors));
                    }

                    return res.status(200).json(response.success());
                });
            });
        },

        readInRequest: function (req, res, next, id) {
            Model.findById(req.params.id, function (err, item) {
                if (err) {
                    debug(err);
                    return res.status(500).json(response.error());
                }

                if (!item) {
                    return res.status(404).json(response.not_found());
                }

                req.item = item;
                next();
            });
        }
    };
};