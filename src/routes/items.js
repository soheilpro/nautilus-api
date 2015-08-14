var express = require('express');
var async = require('async');
var _ = require('underscore');
var DB = require('../db.js');

var router = express.Router();

router.get('/', function(request, response, next) {
  var db = new DB();

  db.getItems(function(error, items) {
    if (error) {
      next(error);
      return;
    }

    async.each(items, function(item, callback) {
      router.expandItem(item, db, callback);
    }, function(error) {
      response.json({
        data: items
      });
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
    if (error) {
      next(error);
      return;
    }

    router.expandItem(item, db, function(error) {
      if (error) {
        next(error);
        return;
      }

      response.json({
        data: item
      });
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
    if (error) {
      next(error);
      return;
    }

    router.expandItem(item, db, function(error) {
      if (error) {
        next(error);
        return;
      }

      response.json({
        data: item
      });
    });
  });
});

router.expandItem = function(item, db, callback) {
  if (!item.type)
    item.type = 'issue';

  if (!item.title)
    item.title = '';

  if (!item.description)
    item.description = '';

  if (!item.tags)
    item.tags = [];

  if (!item.prerequisiteItems)
    item.prerequisiteItems = [];

  if (!item.subItems)
    item.subItems = [];

  if (!item.assignedUsers)
    item.assignedUsers = [];

  async.parallel([
    function(callback) {
      if (!item.state) {
        callback();
        return;
      }

      db.getStateById(item.state.id, function(error, state) {
        if (error) {
          callback(error);
          return;
        }

        item.state = state;
        callback();
      });
    },
    function(callback) {
      if (!item.project) {
        callback();
        return;
      }

      db.getProjectById(item.project.id, function(error, project) {
        if (error) {
          callback(error);
          return;
        }

        item.project = project;
        callback();
      });
    },
    function(callback) {
      async.each(item.prerequisiteItems, function(prerequisiteItem, callback) {
        db.getItemById(prerequisiteItem.id, function(error, item2) {
          if (error) {
            callback(error);
            return;
          }

          item.prerequisiteItems[item.prerequisiteItems.indexOf(prerequisiteItem)] = item2;
          router.expandItem(item2, db, callback);
        });
      }, function(error) {
        callback(error);
      });
    },
    function(callback) {
      async.each(item.subItems, function(subItem, callback) {
        db.getItemById(subItem.id, function(error, item2) {
          if (error) {
            callback(error);
            return;
          }

          item.subItems[item.subItems.indexOf(subItem)] = item2;
          router.expandItem(item2, db, callback);
        });
      }, function(error) {
        callback(error);
      });
    },
    function(callback) {
      async.each(item.assignedUsers, function(assignedUser, callback) {
        db.getUserById(assignedUser.id, function(error, user) {
          if (error) {
            callback(error);
            return;
          }

          item.assignedUsers[item.assignedUsers.indexOf(assignedUser)] = user;
          callback();
        });
      }, function(error) {
        callback(error);
      });
    }
  ],
  function(error) {
    callback(error);
  });
}

module.exports = router;
