var express = require('express');
var async = require('async');
var _ = require('underscore');
var DB = require('../db.js');

var router = express.Router();

router.get('/', function(request, response, next) {
  var db = new DB();

  db.getItems(null, function(error, items) {
    if (error)
      return next(error);

    response.json({
      data: items
    });
  });
});

router.post('/', function(request, response, next) {
  var item = {};

  if (request.param('type'))
    item.type = request.param('type');
  else
    item.type = 'issue';

  if (request.param('title'))
    item.title = request.param('title');

  if (request.param('description'))
    item.description = request.param('description');

  if (request.param('state_id'))
    item.state = { id: request.param('state_id') };

  if (request.param('project_id'))
    item.project = { id: request.param('project_id') };

  if (request.param('tags'))
    item.tags = request.param('tags').split(' ');

  if (request.param('prerequisite_item_ids'))
    item.prerequisiteItems = _.map(request.param('prerequisite_item_ids').split(','), function(id) { return { id: id }; });

  if (request.param('sub_item_ids'))
    item.subItems = _.map(request.param('sub_item_ids').split(','), function(id) { return { id: id }; });

  if (request.param('assigned_user_ids'))
    item.assignedUsers = _.map(request.param('assigned_user_ids').split(','), function(id) { return { id: id }; });

  var db = new DB();

  db.insertItem(item, function(error, item) {
    if (error)
      return next(error);

    response.json({
      data: item
    });
  });
});

router.patch('/:itemId', function(request, response, next) {
  var db = new DB();
  var change = {};

  if (request.param('title') !== undefined)
    change.title = request.param('title');

  if (request.param('description') !== undefined)
    change.description = request.param('description');

  if (request.param('state_id') !== undefined)
    if (request.param('state_id'))
      change.state = { id: request.param('state_id') };
    else
      change.state = null;

  if (request.param('project_id') !== undefined)
    if (request.param('project_id'))
      change.project = { id: request.param('project_id') };
    else
      change.project = null;

  if (request.param('tags') !== undefined)
    change.tags = request.param('tags').split(' ');

  if (request.param('prerequisite_item_ids') !== undefined)
    if (request.param('prerequisite_item_ids'))
      change.prerequisiteItems = _.map(request.param('prerequisite_item_ids').split(','), function(id) { return { id: id }; });
    else
      change.prerequisiteItems = null;

  if (request.param('add_prerequisite_item_ids'))
    change.prerequisiteItems_add = _.map(request.param('add_prerequisite_item_ids').split(','), function(id) { return { id: id }; });

  if (request.param('remove_prerequisite_item_ids'))
    change.prerequisiteItems_remove = _.map(request.param('remove_prerequisite_item_ids').split(','), function(id) { return { id: id }; });

  if (request.param('sub_item_ids') !== undefined)
    if (request.param('sub_item_ids'))
      change.subItems = _.map(request.param('sub_item_ids').split(','), function(id) { return { id: id }; });
    else
      change.subItems = null;

  if (request.param('add_sub_item_ids'))
    change.subItems_add = _.map(request.param('add_sub_item_ids').split(','), function(id) { return { id: id }; });

  if (request.param('remove_sub_item_ids'))
    change.subItems_remove = _.map(request.param('remove_sub_item_ids').split(','), function(id) { return { id: id }; });

  if (request.param('assigned_user_ids') !== undefined)
    if (request.param('assigned_user_ids'))
      change.assignedUsers = _.map(request.param('assigned_user_ids').split(','), function(id) { return { id: id }; });
    else
      change.assignedUsers = null;

  if (request.param('add_assigned_user_ids'))
    change.assignedUsers_add = _.map(request.param('add_assigned_user_ids').split(','), function(id) { return { id: id }; });

  if (request.param('remove_assigned_user_ids'))
    change.assignedUsers_remove = _.map(request.param('remove_assigned_user_ids').split(','), function(id) { return { id: id }; });

  db.updateItem(request.param('itemId'), change, function(error, item) {
    if (error)
      return next(error);

    response.json({
      data: item
    });
  });
});

router.expandItem = function(item, db, callback) {
  callback(item);
}

module.exports = router;
