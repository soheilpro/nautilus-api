var express = require('express');
var async = require('async');
var _ = require('underscore');
var DB = require('../db.js');

var router = express.Router();

router.get('/', function(request, response, next) {
  var db = new DB();

  db.getProjects(null, function(error, projects) {
    if (error)
      return next(error);

    response.json({
      data: projects
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

    response.json({
      data: project
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

    response.json({
      data: project
    });
  });
});

router.expandProject = function(project, db, callback) {
  callback(project);
}

module.exports = router;
