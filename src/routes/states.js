var express = require('express');
var async = require('async');
var _ = require('underscore');
var DB = require('../db.js');

var router = express.Router();

router.get('/', function(request, response, next) {
  var db = new DB();

  db.getStates(function(error, states) {
    if (error)
      return next(error);

    async.each(states, function(state, callback) {
      router.expandState(state, db, callback);
    }, function(error) {
      response.json({
        data: states
      });
    });
  });
});

router.post('/', function(request, response, next) {
  var state = {};

  if (request.param('title'))
    state.title = request.param('title');

  if (request.param('type'))
    state.type = request.param('type');

  if (request.param('color'))
    state.color = request.param('color');

  var db = new DB();

  db.insertState(state, function(error, state) {
    if (error)
      return next(error);

    router.expandState(state, db, function(error) {
      if (error)
        return next(error);

      response.json({
        data: state
      });
    });
  });
});

router.patch('/:stateId', function(request, response, next) {
  var db = new DB();
  var change = {};

  if (request.param('title') !== undefined)
    change.title = request.param('title');

  if (request.param('type') !== undefined)
    change.type = request.param('type');

  if (request.param('color') !== undefined)
    change.color = request.param('color');

  db.updateState(request.param('stateId'), change, function(error, state) {
    if (error)
      return next(error);

    router.expandState(state, db, function(error) {
      if (error)
        return next(error);

      response.json({
        data: state
      });
    });
  });
});

router.expandState = function(state, db, callback) {
  if (!state.title)
    state.title = '';

  if (!state.type)
    state.type = '';

  if (!state.color)
    state.color = '';

  callback();
}

module.exports = router;
