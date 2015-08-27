var express = require('express');
var async = require('async');
var _ = require('underscore');
var DB = require('../db.js');

var router = express.Router();

router.get('/', function(request, response, next) {
  var db = new DB();

  db.getProjects(function(error, projects) {
    if (error)
      return next(error);

    async.each(projects, function(project, callback) {
      router.expandProject(project, db, callback);
    }, function(error) {
      response.json({
        data: projects
      });
    });
  });
});

router.post('/', function(request, response, next) {
  var project = {};

  if (request.param('name'))
    project.name = request.param('name');

  if (request.param('group'))
    project.group = request.param('group');

  var db = new DB();

  db.insertProject(project, function(error, project) {
    if (error)
      return next(error);

    router.expandProject(project, db, function(error) {
      if (error)
        return next(error);

      response.json({
        data: project
      });
    });
  });
});

router.patch('/:projectId', function(request, response, next) {
  var db = new DB();
  var change = {};

  if (request.param('name') !== undefined)
    change.name = request.param('name');

  if (request.param('group') !== undefined)
    change.group = request.param('group');

  db.updateProject(request.param('projectId'), change, function(error, project) {
    if (error)
      return next(error);

    router.expandProject(project, db, function(error) {
      if (error)
        return next(error);

      response.json({
        data: project
      });
    });
  });
});

router.expandProject = function(project, db, callback) {
  if (!project.name)
    project.name = '';

  if (!project.group)
    project.group = '';

  callback();
}

router.get('/states', function(request, response, next) {
  var db = new DB();

  db.getStates(function(error, states) {
    if (error)
      return next(error);

    async.each(states, function(state, callback) {
      expandState(state, db, callback);
    }, function(error) {
      response.json({
        data: states
      });
    });
  });
});

module.exports = router;
