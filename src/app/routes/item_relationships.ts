import { ItemRelationshipRepository } from '../repositories/item_relationship';
import { IUserPermission, UserPermissionHelper } from '../helpers/user_permission';

var express = require('express');
var async = require('async');
var _ = require('underscore');

var router = express.Router();

router.post('/', (request: any, response: any, next: any) => {
  if (!UserPermissionHelper.hasPermission(request.user.permissions, null, 'admin'))
    return response.sendStatus(403);

  var itemRelationship: IItemRelationship = {};

  if (request.param('item1_id'))
    itemRelationship.item1 = objectFromId(request.param('item1_id'));

  if (request.param('item2_id'))
    itemRelationship.item2 = objectFromId(request.param('item2_id'));

  if (request.param('type'))
    itemRelationship.type = request.param('type');

  var repository = new ItemRelationshipRepository();

  repository.insert(itemRelationship, (error, itemRelationship) => {
    if (error)
      return next(error);

    response.json({
      data: itemRelationship
    });
  });
});

router.delete('/:itemRelationshipId', (request: any, response: any, next: any) => {
  var repository = new ItemRelationshipRepository();

  repository.get({ id: request.param('itemRelationshipId') }, (error, item) => {
    if (error)
      return next(error);

    if (!item)
      return response.sendStatus(404);

    repository.delete(item.id, (error) => {
      if (error)
        return next(error);

      response.sendStatus(200);
    });
  });
});

function objectFromId(id: string) {
  return {
    id: id
  };
}

export = router;
