/// <reference path="./typings/index.d.ts" />

import { Repository } from './repository';

var express = require('express');
var passport = require('passport');
var passportHTTP = require('passport-http');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var debug = require('debug')('nautilus-api');

passport.use(new passportHTTP.BasicStrategy((username, password, callback) => {
  var repository = new Repository();

  repository.getSession({ sessionId: username }, (error, session) => {
    if (error)
      return callback(error);

    if (!session)
      return callback(null, false);

    callback(null, session);
  });
}));

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(passport.initialize());

app.use('/sessions', require('./routes/sessions'));
app.use(passport.authenticate('basic', { session: false }));
app.use('/users', require('./routes/users'));
app.use('/states', require('./routes/states'));
app.use('/projects', require('./routes/projects'));
app.use('/items', require('./routes/items'));

app.use((request, response, next) => {
  var error : any = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, request, response, next) => {
  debug(error.stack);
  response.status(error.status || 500);
  response.end();
});

export default app;