import { UserRoleRepository } from '../repositories/user_role';
import { UserPermissionHelper } from '../helpers/user_permission';

var express = require('express');

var router = express.Router();

router.get('/', (request: any, response: any, next: any) => {
  var repository = new UserRoleRepository();

  repository.getAll({}, (error, userRoles) => {
    if (error)
      return next(error);

    response.json({
      data: userRoles
    });
  });
});

router.post('/', (request: any, response: any, next: any) => {
  if (!UserPermissionHelper.hasPermission(request.user.permissions, null, 'admin'))
    return response.sendStatus(403);

  var userRole: IUserRole = {};

  if (request.param('user_id'))
    userRole.user = objectFromId(request.param('user_id'));

  if (request.param('project_id'))
    userRole.project = objectFromId(request.param('project_id'));

  if (request.param('name'))
    userRole.name = request.param('name');

  var repository = new UserRoleRepository();

  repository.insert(userRole, (error, userRole) => {
    if (error)
      return next(error);

    response.json({
      data: userRole
    });
  });
});

router.patch('/:userRoleId', (request: any, response: any, next: any) => {
  if (!UserPermissionHelper.hasPermission(request.user.permissions, null, 'admin'))
    return response.sendStatus(403);

  var repository = new UserRoleRepository();
  var change: IUserRoleChange = {};

  if (request.param('user_id') !== undefined)
    if (request.param('user_id'))
      change.user = objectFromId(request.param('user_id'));
    else
      change.user = null;

  if (request.param('project_id') !== undefined)
    if (request.param('project_id'))
      change.project = objectFromId(request.param('project_id'));
    else
      change.project = null;

  if (request.param('name') !== undefined)
    change.name = request.param('name');

  repository.update(request.param('userRoleId'), change, (error, userRole) => {
    if (error)
      return next(error);

    response.json({
      data: userRole
    });
  });
});

function objectFromId(id: string) {
  return {
    id: id
  };
}

export = router;
