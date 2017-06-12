import { ItemPriorityRepository } from '../repositories/item_priority';
import { UserPermissionHelper } from '../helpers/user_permission';

var express = require('express');

var router = express.Router();

router.get('/', (request: any, response: any, next: any) => {
  var repository = new ItemPriorityRepository();

  repository.getAll({}, (error, itemPriorities) => {
    if (error)
      return next(error);

    response.json({
      data: itemPriorities
    });
  });
});

router.post('/', (request: any, response: any, next: any) => {
  if (!UserPermissionHelper.hasPermission(request.user.permissions, null, 'admin'))
    return response.sendStatus(403);

  var itemPriority: IItemPriority = {};

  if (request.param('item_kind'))
    itemPriority.itemKind = request.param('item_kind');

  if (request.param('title'))
    itemPriority.title = request.param('title');

  if (request.param('key'))
    itemPriority.key = request.param('key');

  if (request.param('order'))
    itemPriority.order = parseInt(request.param('order'), 10);

  var repository = new ItemPriorityRepository();

  repository.insert(itemPriority, (error, itemPriority) => {
    if (error)
      return next(error);

    response.json({
      data: itemPriority
    });
  });
});

router.patch('/:priorityId', (request: any, response: any, next: any) => {
  if (!UserPermissionHelper.hasPermission(request.user.permissions, null, 'admin'))
    return response.sendStatus(403);

  var repository = new ItemPriorityRepository();
  var change: IItemPriorityChange = {};

  if (request.param('item_kind') !== undefined)
    change.itemKind = request.param('item_kind');

  if (request.param('title') !== undefined)
    change.title = request.param('title');

  if (request.param('key') !== undefined)
    change.key = request.param('key');

  if (request.param('order') !== undefined)
    change.order = parseInt(request.param('order'), 10);

  repository.update(request.param('priorityId'), change, (error, itemPriority) => {
    if (error)
      return next(error);

    response.json({
      data: itemPriority
    });
  });
});

export = router;
