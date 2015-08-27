var express = require('express');
var async = require('async');
var bcrypt = require('bcryptjs');
var uuid = require('node-uuid');
var _ = require('underscore');
var DB = require('../db.js');

var router = express.Router();

router.get('/:sessionId', function(request, response, next) {
  var db = new DB();

  db.getSessionById(request.param('sessionId'), function(error, session) {
    if (error)
      return next(error);

    if (!session) {
      var error = new Error();
      error.status = 404;

      return next(error);
    }

    router.expandSession(session, db, function() {
      response.json({
        data: session
      });
    });
  });
});

router.post('/', function(request, response, next) {
  var username = request.param('username');
  var password = request.param('password');

  var db = new DB();

  db.getUserByUsername(username, function(error, user) {
    if (error)
      return next(error);

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      response.status(403);
      response.end();
      return;
    }

    var session = {
      id: uuid.v4().replace(/-/g, ''),
      user: user
    };

    db.insertSession(session, function(error, session) {
      if (error)
        return next(error);

      router.expandSession(session, db, function(error) {
        if (error)
          return next(error);

        response.status(201);

        response.json({
          data: session
        });
      });
    });
  });
});

router.expandSession = function(session, db, callback) {
  callback();
}

module.exports = router;
