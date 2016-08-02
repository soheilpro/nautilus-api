/// <reference path="../typings/index.d.ts" />

import { Repository } from '../repository';

var express = require('express');
var async = require('async');
var bcrypt = require('bcryptjs');
var uuid = require('node-uuid');
var _ = require('underscore');

var router = express.Router();

router.get('/:sessionId', (request, response, next) => {
  var repository = new Repository();

  repository.getSession({ sessionId: request.param('sessionId') }, (error, session) => {
    if (error)
      return next(error);

    if (!session) {
      var error : any = new Error();
      error.status = 404;

      return next(error);
    }

    response.json({
      data: session
    });
  });
});

router.post('/', (request, response, next) => {
  var username = request.param('username');
  var password = request.param('password');

  var repository = new Repository();

  repository.getUser({ username: username }, (error, user) => {
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

    repository.insertSession(session, (error, session) => {
      if (error)
        return next(error);

      response.status(201);

      response.json({
        data: session
      });
    });
  });
});

router.expandSession = (session, repository, callback) => {
  callback(session);
}

export = router;