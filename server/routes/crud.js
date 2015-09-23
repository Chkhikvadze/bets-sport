
module.exports.model = function (Model) {
  var express = require('express');
  var router = express.Router();
  var crudController = require('../controllers/crudController.js')(Model);

  router.route('/')
    .get(crudController.list) // get all items
    .post(crudController.create); // Create new Item

  router.route('/:id')
    .get(crudController.read) // Get Item by Id
    .put(crudController.update) // Update an Item with a given Id
    .delete(crudController.delete); // Delete and Item by Id

  return router;
};

module.exports.modelGet = function (Model) {
  var express = require('express');
  var router = express.Router();
  var crudController = require('../controllers/crudController.js')(Model);

  router.route('/')
      .get(crudController.list) // get all items

  router.route('/:id')
      .get(crudController.read) // Get Item by Id

  return router;
};

module.exports.controller = function (Controller) {
  var express = require('express');
  var router = express.Router();

  router.route('/')
    .get(Controller.list) // get all items
    .post(Controller.create); // Create new Item

  router.route('/:id')
    .get(Controller.read) // Get Item by Id
    .put(Controller.update) // Update an Item with a given Id
    .delete(Controller.delete); // Delete and Item by Id

  return router;
};

module.exports.controller = function (Controller) {
  var express = require('express');
  var router = express.Router();

  router.route('/')
    .get(Controller.list) // get all items
    .post(Controller.create); // Create new Item

  router.route('/:id')
    .get(Controller.read) // Get Item by Id
    .put(Controller.update) // Update an Item with a given Id
    .delete(Controller.delete); // Delete and Item by Id

  return router;
};