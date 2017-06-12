import { ItemStateRepository } from '../repositories/item_state';
import { UserPermissionHelper } from '../helpers/user_permission';

var express = require('express');

var router = express.Router();

router.get('/', (request: any, response: any, next: any) => {
  var repository = new ItemStateRepository();

  repository.getAll({}, (error, itemStates) => {
    if (error)
      return next(error);

    response.json({
      data: itemStates
    });
  });
});

router.post('/', (request: any, response: any, next: any) => {
  if (!UserPermissionHelper.hasPermission(request.user.permissions, null, 'admin'))
    return response.sendStatus(403);

  var itemState: IItemState = {};

  if (request.param('item_kind'))
    itemState.itemKind = request.param('item_kind');

  if (request.param('title'))
    itemState.title = request.param('title');

  if (request.param('key'))
    itemState.key = request.param('key');

  if (request.param('order'))
    itemState.order = parseInt(request.param('order'), 10);

  var repository = new ItemStateRepository();

  repository.insert(itemState, (error, itemState) => {
    if (error)
      return next(error);

    response.json({
      data: itemState
    });
  });
});

router.patch('/:stateId', (request: any, response: any, next: any) => {
  if (!UserPermissionHelper.hasPermission(request.user.permissions, null, 'admin'))
    return response.sendStatus(403);

  var repository = new ItemStateRepository();
  var change: IItemStateChange = {};

  if (request.param('item_kind') !== undefined)
    change.itemKind = request.param('item_kind');

  if (request.param('title') !== undefined)
    change.title = request.param('title');

  if (request.param('key') !== undefined)
    change.key = request.param('key');

  if (request.param('order') !== undefined)
    change.order = parseInt(request.param('order'), 10);

  repository.update(request.param('stateId'), change, (error, itemState) => {
    if (error)
      return next(error);

    response.json({
      data: itemState
    });
  });
});

export = router;
