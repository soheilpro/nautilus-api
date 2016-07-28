/// <reference path="../typings/index.d.ts" />

import { Repository } from '../repository';

var express = require('express');
var async = require('async');
var bcrypt = require('bcryptjs');
var _ = require('underscore');

var router = express.Router();

router.get('/', (request, response, next) => {
  var repository = new Repository();

  repository.getUsers(null, (error, users) => {
    if (error)
      return next(error);

    response.json({
      data: users
    });
  });
});

router.post('/', (request, response, next) => {
  var user : any = {};

  if (request.param('username'))
    user.username = request.param('username');

  if (request.param('password'))
    user.passwordHash = bcrypt.hashSync(request.param('password'), bcrypt.genSaltSync(10));

  if (request.param('name'))
    user.name = request.param('name');

  var repository = new Repository();

  repository.insertUser(user, (error, user) => {
    if (error)
      return next(error);

    response.json({
      data: user
    });
  });
});

router.patch('/:userId', (request, response, next) => {
  var repository = new Repository();
  var change : any = {};

  if (request.param('username') !== undefined)
    change.username = request.param('username');

  if (request.param('password') !== undefined)
    change.passwordHash = bcrypt.hashSync(request.param('password'), bcrypt.genSaltSync(10));

  if (request.param('name') !== undefined)
    change.name = request.param('name');

  repository.updateUser(request.param('userId'), change, (error, user) => {
    if (error)
      return next(error);

    response.json({
      data: user
    });
  });
});

router.expandUser = (user, db, callback) => {
  callback(user);
}

export = router;
