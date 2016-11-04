import { ProjectRepository } from '../repositories/project';
import { IUserPermission, UserPermissionHelper } from '../helpers/user_permission';

var express = require('express');
var async = require('async');
var _ = require('underscore');

var router = express.Router();

router.get('/', (request: any, response: any, next: any) => {
  var repository = new ProjectRepository();

  repository.getAll({}, (error, projects) => {
    if (error)
      return next(error);

    projects = projects.filter(project => UserPermissionHelper.hasPermission(request.user.permissions, project, 'view'));

    response.json({
      data: projects
    });
  });
});

router.post('/', (request: any, response: any, next: any) => {
  if (!UserPermissionHelper.hasPermission(request.user.permissions, null, 'admin'))
    return response.sendStatus(403);

  var project: IProject = {};

  if (request.param('name'))
    project.name = request.param('name');

  if (request.param('description'))
    project.description = request.param('description');

  if (request.param('tags'))
    project.tags = request.param('tags').split(' ');

  var repository = new ProjectRepository();

  repository.insert(project, (error, project) => {
    if (error)
      return next(error);

    response.json({
      data: project
    });
  });
});

router.patch('/:projectId', (request: any, response: any, next: any) => {
  if (!UserPermissionHelper.hasPermission(request.user.permissions, null, 'admin'))
    return response.sendStatus(403);

  var repository = new ProjectRepository();
  var change: IProjectChange = {};

  if (request.param('name') !== undefined)
    change.name = request.param('name');

  if (request.param('description') !== undefined)
    change.description = request.param('description');

  if (request.param('tags') !== undefined)
    if (request.param('tags'))
      change.tags = request.param('tags').split(' ');
    else
      change.tags = null;

  repository.update(request.param('projectId'), change, (error, project) => {
    if (error)
      return next(error);

    response.json({
      data: project
    });
  });
});

export = router;
