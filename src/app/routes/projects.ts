/// <reference path="../typings/index.d.ts" />

import { Repository } from '../repository';

var express = require('express');
var async = require('async');
var _ = require('underscore');

var router = express.Router();

router.get('/', (request, response, next) => {
  var repository = new Repository();

  repository.getProjects(null, (error, projects) => {
    if (error)
      return next(error);

    response.json({
      data: projects
    });
  });
});

router.post('/', (request, response, next) => {
  var project : any = {};

  if (request.param('name'))
    project.name = request.param('name');

  if (request.param('group'))
    project.group = request.param('group');

  var repository = new Repository();

  repository.insertProject(project, (error, project) => {
    if (error)
      return next(error);

    response.json({
      data: project
    });
  });
});

router.patch('/:projectId', (request, response, next) => {
  var repository = new Repository();
  var change : any = {};

  if (request.param('name') !== undefined)
    change.name = request.param('name');

  if (request.param('group') !== undefined)
    change.group = request.param('group');

  repository.updateProject(request.param('projectId'), change, (error, project) => {
    if (error)
      return next(error);

    response.json({
      data: project
    });
  });
});

router.expandProject = (project, repository, callback) => {
  callback(project);
}

export = router;
