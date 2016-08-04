import { StateRepository } from '../repositories/state';

var express = require('express');
var async = require('async');
var _ = require('underscore');

var router = express.Router();

router.get('/', (request: any, response: any, next: any) => {
  var repository = new StateRepository();

  repository.getAll({}, (error, states) => {
    if (error)
      return next(error);

    response.json({
      data: states
    });
  });
});

router.post('/', (request: any, response: any, next: any) => {
  var state: IState = {};

  if (request.param('title'))
    state.title = request.param('title');

  if (request.param('type'))
    state.type = request.param('type');

  if (request.param('color'))
    state.color = request.param('color');

  var repository = new StateRepository();

  repository.insert(state, (error, state) => {
    if (error)
      return next(error);

    response.json({
      data: state
    });
  });
});

router.patch('/:stateId', (request: any, response: any, next: any) => {
  var repository = new StateRepository();
  var change: IStateChange = {};

  if (request.param('title') !== undefined)
    change.title = request.param('title');

  if (request.param('type') !== undefined)
    change.type = request.param('type');

  if (request.param('color') !== undefined)
    change.color = request.param('color');

  repository.update(request.param('stateId'), change, (error, state) => {
    if (error)
      return next(error);

    response.json({
      data: state
    });
  });
});

export = router;
