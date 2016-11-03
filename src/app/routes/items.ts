import { ItemRepository } from '../repositories/item';
import { UserLogRepository } from '../repositories/user_log';
import { IUserPermission, UserPermissionHelper } from '../helpers/user_permission';

var express = require('express');
var async = require('async');
var _ = require('underscore');

var router = express.Router();

router.get('/', (request: any, response: any, next: any) => {
  var repository = new ItemRepository();

  repository.getAll({ type: objectFromId(request.param('type_id')) }, (error, items) => {
    if (error)
      return next(error);

    items = items.filter(item => {
      if (item.project)
        return UserPermissionHelper.hasPermission(request.user.permissions, item.project, 'view');

      return item.createdBy.id === request.user.user.id;
    });

    response.json({
      data: items
    });
  });
});

router.post('/', (request: any, response: any, next: any) => {
  var item: IItem = {};
  item.createdBy = request.user.user;

  if (request.param('type_id'))
    item.type = objectFromId(request.param('type_id'));

  if (request.param('title'))
    item.title = request.param('title');

  if (request.param('description'))
    item.description = request.param('description');

  if (request.param('state_id'))
    item.state = objectFromId(request.param('state_id'));

  if (request.param('priority_id'))
    item.priority = objectFromId(request.param('priority_id'));

  if (request.param('tags'))
    item.tags = request.param('tags').split(' ');

  if (request.param('project_id'))
    item.project = objectFromId(request.param('project_id'));

  if (request.param('parent_id'))
    item.parent = objectFromId(request.param('parent_id'));

  if (request.param('assigned_to_id'))
    item.assignedTo = objectFromId(request.param('assigned_to_id'));

  if (item.project)
    if (!UserPermissionHelper.hasPermission(request.user.permissions, item.project, 'update'))
      return response.sendStatus(403);

  var repository = new ItemRepository();
  var userLogRepository = new UserLogRepository();

  repository.insert(item, (error, item) => {
    if (error)
      return next(error);

    var userLog: IUserLog = {
      dateTime: new Date(),
      user: request.user.user,
      action: 'items.insert',
      item: item,
      params: {
        item: item
      }
    };

    userLogRepository.insert(userLog, (error) => {
      if (error)
        return next(error);

      response.json({
        data: item
      });
    });
  });
});

router.patch('/:itemId', (request: any, response: any, next: any) => {
  var repository = new ItemRepository();

  repository.get({ id: request.param('itemId') }, (error, item) => {
    if (error)
      return next(error);

    if (!item)
      return response.sendStatus(404);

    if (item.project)
      if (!UserPermissionHelper.hasPermission(request.user.permissions, item.project, 'update'))
        return response.sendStatus(403);

    var change: IItemChange = {};

    if (request.param('type_id') !== undefined)
      if (request.param('type_id'))
        change.type = objectFromId(request.param('type_id'));
      else
        change.type = null;

    if (request.param('title') !== undefined)
      change.title = request.param('title');

    if (request.param('description') !== undefined)
      change.description = request.param('description');

    if (request.param('state_id') !== undefined)
      if (request.param('state_id'))
        change.state = objectFromId(request.param('state_id'));
      else
        change.state = null;

    if (request.param('priority_id') !== undefined)
      if (request.param('priority_id'))
        change.priority = objectFromId(request.param('priority_id'));
      else
        change.priority = null;

    if (request.param('tags') !== undefined)
      if (request.param('tags'))
        change.tags = request.param('tags').split(' ');
      else
        change.tags = null;

    if (request.param('project_id') !== undefined)
      if (request.param('project_id'))
        change.project = objectFromId(request.param('project_id'));
      else
        change.project = null;

    if (request.param('parent_id') !== undefined)
      if (request.param('parent_id'))
        change.parent = objectFromId(request.param('parent_id'));
      else
        change.parent = null;


    if (request.param('assigned_to_id') !== undefined)
      if (request.param('assigned_to_id'))
        change.assignedTo = objectFromId(request.param('assigned_to_id'));
      else
        change.assignedTo = null;

    if (change.project)
      if (!UserPermissionHelper.hasPermission(request.user.permissions, change.project, 'update'))
        return response.sendStatus(403);

    change.modifiedBy = request.user.user;

    repository.update(item.id, change, (error, item) => {
      if (error)
        return next(error);

      var userLog: IUserLog = {
        dateTime: new Date(),
        user: request.user.user,
        action: 'items.update',
        item: item,
        params: {
          change: change
        }
      };

      var userLogRepository = new UserLogRepository();

      userLogRepository.insert(userLog, (error) => {
        if (error)
          return next(error);

        response.json({
          data: item
        });
      });
    });
  });
});

router.delete('/:itemId', (request: any, response: any, next: any) => {
  var repository = new ItemRepository();

  repository.get({ id: request.param('itemId') }, (error, item) => {
    if (error)
      return next(error);

    if (!item)
      return response.sendStatus(404);

    repository.delete(item.id, (error) => {
      if (error)
        return next(error);

      var userLog: IUserLog = {
        dateTime: new Date(),
        user: request.user.user,
        action: 'items.delete',
        item: item
      };

      var userLogRepository = new UserLogRepository();

      userLogRepository.insert(userLog, (error) => {
        if (error)
          return next(error);

        response.sendStatus(200);
      });
    });
  });
});

function objectFromId(id: string) {
  return {
    id: id
  };
}

export = router;
