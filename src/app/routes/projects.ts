import { ProjectRepository } from '../repositories/project';

var express = require('express');
var async = require('async');
var _ = require('underscore');

var router = express.Router();

router.get('/', (request: any, response: any, next: any) => {
  var repository = new ProjectRepository();

  repository.getAll({}, (error, projects) => {
    if (error)
      return next(error);

    response.json({
      data: projects
    });
  });
});

router.post('/', (request: any, response: any, next: any) => {
  var project: IProject = {};

  if (request.param('name'))
    project.name = request.param('name');

  if (request.param('group'))
    project.group = request.param('group');

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
  var repository = new ProjectRepository();
  var change: IProjectChange = {};

  if (request.param('name') !== undefined)
    change.name = request.param('name');

  if (request.param('group') !== undefined)
    change.group = request.param('group');

  repository.update(request.param('projectId'), change, (error, project) => {
    if (error)
      return next(error);

    response.json({
      data: project
    });
  });
});

export = router;
