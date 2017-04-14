import { ItemTypeRepository } from '../repositories/item_type';
import { IUserPermission, UserPermissionHelper } from '../helpers/user_permission';

var express = require('express');
var async = require('async');
var _ = require('underscore');

var router = express.Router();

router.get('/', (request: any, response: any, next: any) => {
  var repository = new ItemTypeRepository();

  repository.getAll({}, (error, itemTypes) => {
    if (error)
      return next(error);

    response.json({
      data: itemTypes
    });
  });
});

router.post('/', (request: any, response: any, next: any) => {
  if (!UserPermissionHelper.hasPermission(request.user.permissions, null, 'admin'))
    return response.sendStatus(403);

  var itemType: IItemType = {};

  if (request.param('item_kind'))
    itemType.itemKind = request.param('item_kind');

  if (request.param('title'))
    itemType.title = request.param('title');

  if (request.param('key'))
    itemType.key = request.param('key');

  if (request.param('order'))
    itemType.order = parseInt(request.param('order'), 10);

  var repository = new ItemTypeRepository();

  repository.insert(itemType, (error, itemType) => {
    if (error)
      return next(error);

    response.json({
      data: itemType
    });
  });
});

router.patch('/:typeId', (request: any, response: any, next: any) => {
  if (!UserPermissionHelper.hasPermission(request.user.permissions, null, 'admin'))
    return response.sendStatus(403);

  var repository = new ItemTypeRepository();
  var change: IItemTypeChange = {};

  if (request.param('item_kind') !== undefined)
    change.itemKind = request.param('item_kind');

  if (request.param('title') !== undefined)
    change.title = request.param('title');

  if (request.param('key') !== undefined)
    change.key = request.param('key');

  if (request.param('order') !== undefined)
    change.order = parseInt(request.param('order'), 10);

  repository.update(request.param('typeId'), change, (error, itemType) => {
    if (error)
      return next(error);

    response.json({
      data: itemType
    });
  });
});

export = router;
