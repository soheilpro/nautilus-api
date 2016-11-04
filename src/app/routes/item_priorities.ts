import { ItemPriorityRepository } from '../repositories/item_priority';
import { IUserPermission, UserPermissionHelper } from '../helpers/user_permission';

var express = require('express');
var async = require('async');
var _ = require('underscore');

var router = express.Router();

router.get('/', (request: any, response: any, next: any) => {
  var repository = new ItemPriorityRepository();

  repository.getAll({}, (error, priorities) => {
    if (error)
      return next(error);

    response.json({
      data: priorities
    });
  });
});

router.post('/', (request: any, response: any, next: any) => {
  if (!UserPermissionHelper.hasPermission(request.user.permissions, null, 'admin'))
    return response.sendStatus(403);

  var priority: IItemPriority = {};

  if (request.param('title'))
    priority.title = request.param('title');

  if (request.param('key'))
    priority.key = request.param('key');

  if (request.param('order'))
    priority.order = parseInt(request.param('order'), 10);

  var repository = new ItemPriorityRepository();

  repository.insert(priority, (error, priority) => {
    if (error)
      return next(error);

    response.json({
      data: priority
    });
  });
});

router.patch('/:priorityId', (request: any, response: any, next: any) => {
  if (!UserPermissionHelper.hasPermission(request.user.permissions, null, 'admin'))
    return response.sendStatus(403);

  var repository = new ItemPriorityRepository();
  var change: IItemPriorityChange = {};

  if (request.param('title') !== undefined)
    change.title = request.param('title');

  if (request.param('key') !== undefined)
    change.key = request.param('key');

  if (request.param('order') !== undefined)
    change.order = parseInt(request.param('order'), 10);

  repository.update(request.param('priorityId'), change, (error, priority) => {
    if (error)
      return next(error);

    response.json({
      data: priority
    });
  });
});

export = router;
