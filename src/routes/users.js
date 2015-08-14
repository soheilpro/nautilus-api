var express = require('express');
var async = require('async');
var _ = require('underscore');
var DB = require('../db.js');

var router = express.Router();

router.get('/', function(request, response, next) {
  var db = new DB();

  db.getUsers(function(error, users) {
    if (error) {
      next(error);
      return;
    }

    async.each(users, function(user, callback) {
      router.expandUser(user, db, callback);
    }, function(error) {
      response.json({
        data: users
      });
    });
  });
});

router.post('/', function(request, response, next) {
  var user = {};

  if (request.param('name'))
    user.name = request.param('name');

  var db = new DB();

  db.insertUser(user, function(error, user) {
    if (error) {
      next(error);
      return;
    }

    router.expandUser(user, db, function(error) {
      if (error) {
        next(error);
        return;
      }

      response.json({
        data: user
      });
    });
  });
});

router.patch('/:userId', function(request, response, next) {
  var db = new DB();
  var change = {};

  if (request.param('name') !== undefined)
    change.name = request.param('name');

  db.updateUser(request.param('userId'), change, function(error, user) {
    if (error) {
      next(error);
      return;
    }

    router.expandUser(user, db, function(error) {
      if (error) {
        next(error);
        return;
      }

      response.json({
        data: user
      });
    });
  });
});

router.expandUser = function(user, db, callback) {
  if (!user.name)
    user.name = '';

  callback();
}

module.exports = router;
