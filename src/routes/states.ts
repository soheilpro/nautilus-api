/// <reference path="../typings/index.d.ts" />

import { Repository } from '../repository';

var express = require('express');
var async = require('async');
var _ = require('underscore');

var router = express.Router();

router.get('/', (request, response, next) => {
  var repository = new Repository();

  repository.getStates(null, (error, states) => {
    if (error)
      return next(error);

    response.json({
      data: states
    });
  });
});

router.post('/', (request, response, next) => {
  var state : any = {};

  if (request.param('title'))
    state.title = request.param('title');

  if (request.param('type'))
    state.type = request.param('type');

  if (request.param('color'))
    state.color = request.param('color');

  var repository = new Repository();

  repository.insertState(state, (error, state) => {
    if (error)
      return next(error);

    response.json({
      data: state
    });
  });
});

router.patch('/:stateId', (request, response, next) => {
  var repository = new Repository();
  var change : any = {};

  if (request.param('title') !== undefined)
    change.title = request.param('title');

  if (request.param('type') !== undefined)
    change.type = request.param('type');

  if (request.param('color') !== undefined)
    change.color = request.param('color');

  repository.updateState(request.param('stateId'), change, (error, state) => {
    if (error)
      return next(error);

    response.json({
      data: state
    });
  });
});

router.expandState = (state, repository, callback) => {
  callback(state);
}

export = router;
