import { ItemStateRepository } from '../repositories/item_state';
import { IUserPermission, UserPermissionHelper } from '../helpers/user_permission';

var express = require('express');
var async = require('async');
var _ = require('underscore');

var router = express.Router();

router.get('/', (request: any, response: any, next: any) => {
  var repository = new ItemStateRepository();

  repository.getAll({}, (error, states) => {
    if (error)
      return next(error);

    response.json({
      data: states
    });
  });
});

router.post('/', (request: any, response: any, next: any) => {
  if (!UserPermissionHelper.hasPermission(request.user.permissions, null, 'admin'))
    return response.sendStatus(403);

  var state: IItemState = {};

  if (request.param('title'))
    state.title = request.param('title');

  if (request.param('key'))
    state.key = request.param('key');

  var repository = new ItemStateRepository();

  repository.insert(state, (error, state) => {
    if (error)
      return next(error);

    response.json({
      data: state
    });
  });
});

router.patch('/:stateId', (request: any, response: any, next: any) => {
  if (!UserPermissionHelper.hasPermission(request.user.permissions, null, 'admin'))
    return response.sendStatus(403);

  var repository = new ItemStateRepository();
  var change: IItemStateChange = {};

  if (request.param('title') !== undefined)
    change.title = request.param('title');

  if (request.param('key') !== undefined)
    change.key = request.param('key');

  repository.update(request.param('stateId'), change, (error, state) => {
    if (error)
      return next(error);

    response.json({
      data: state
    });
  });
});

export = router;
