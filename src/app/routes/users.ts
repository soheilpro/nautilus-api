import { UserRepository } from '../repositories/user';
import { IUserPermission, UserPermissionHelper } from '../helpers/user_permission';

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

router.get('/:userId/permissions', (request: any, response: any, next: any) => {
  if (request.param('userId') !== request.user.user.id) {
    response.status(403);
    response.end();
    return;
  }

  response.json({
    data: request.user.permissions
  });
});

router.post('/', (request: any, response: any, next: any) => {
  if (!UserPermissionHelper.hasPermission(request.user.permissions, null, 'admin'))
    return response.sendStatus(403);

  var user: IUser = {};

  if (request.param('username'))
    user.username = request.param('username');

  if (request.param('password'))
    user.passwordHash = bcrypt.hashSync(request.param('password'), bcrypt.genSaltSync(10));

  if (request.param('name'))
    user.name = request.param('name');

  if (request.param('email'))
    user.email = request.param('email');

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
  if (!UserPermissionHelper.hasPermission(request.user.permissions, null, 'admin'))
    return response.sendStatus(403);

  var repository = new UserRepository();
  var change: IUserChange = {};

  if (request.param('username') !== undefined)
    change.username = request.param('username');

  if (request.param('password') !== undefined)
    change.passwordHash = bcrypt.hashSync(request.param('password'), bcrypt.genSaltSync(10));

  if (request.param('name') !== undefined)
    change.name = request.param('name');

  if (request.param('email') !== undefined)
    change.email = request.param('email');

  repository.update(request.param('userId'), change, (error, user) => {
    if (error)
      return next(error);

    response.json({
      data: user
    });
  });
});

export = router;
