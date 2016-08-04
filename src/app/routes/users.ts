import { UserRepository } from '../repositories/user';

var express = require('express');
var async = require('async');
var bcrypt = require('bcryptjs');
var _ = require('underscore');

var router = express.Router();

router.get('/', (request: any, response: any, next: any) => {
  var repository = new UserRepository();

  repository.getAll({}, (error: Error, users: IUser[]) => {
    if (error)
      return next(error);

    response.json({
      data: users
    });
  });
});

router.post('/', (request: any, response: any, next: any) => {
  var user: IUser = {};

  if (request.param('username'))
    user.username = request.param('username');

  if (request.param('password'))
    user.passwordHash = bcrypt.hashSync(request.param('password'), bcrypt.genSaltSync(10));

  if (request.param('name'))
    user.name = request.param('name');

  var repository = new UserRepository();

  repository.insert(user, (error, user) => {
    if (error)
      return next(error);

    response.json({
      data: user
    });
  });
});

router.patch('/:userId', (request: any, response: any, next: any) => {
  var repository = new UserRepository();
  var change: IUserChange = {};

  if (request.param('username') !== undefined)
    change.username = request.param('username');

  if (request.param('password') !== undefined)
    change.passwordHash = bcrypt.hashSync(request.param('password'), bcrypt.genSaltSync(10));

  if (request.param('name') !== undefined)
    change.name = request.param('name');

  repository.update(request.param('userId'), change, (error, user) => {
    if (error)
      return next(error);

    response.json({
      data: user
    });
  });
});

export = router;
