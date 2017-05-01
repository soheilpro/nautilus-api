import { SessionRepository } from './repositories/session';
import { UserPermissionHelper } from './helpers/user_permission';

var express = require('express');
var passport = require('passport');
var passportHTTP = require('passport-http');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var debug = require('debug')('nautilus-api');
var compression = require('compression');

passport.use(new passportHTTP.BasicStrategy((username: string, password: string, callback: (error: Error, user?: Object) => void) => {
  var sessionRepository = new SessionRepository();

  sessionRepository.get({ accessToken: username }, (error, session) => {
    if (error)
      return callback(error);

    if (!session)
      return callback(null, false);

    callback(null, session);
  });
}));

var app = express();
app.use(compression())
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(passport.initialize());

app.use('/sessions', require('./routes/sessions'));
app.use(passport.authenticate('basic', { session: false }));

app.use((request: any, response: any, next: any) => {
  UserPermissionHelper.getUserPermissions(request.user.user, (error, permissions) => {
    if (error)
      return next(error);

    request.user.permissions = permissions;

    next();
  });
});

app.use('/users', require('./routes/users'));
app.use('/userroles', require('./routes/user_roles'));
app.use('/itemstates', require('./routes/item_states'));
app.use('/itemtypes', require('./routes/item_types'));
app.use('/itempriorities', require('./routes/item_priorities'));
app.use('/projects', require('./routes/projects'));
app.use('/items', require('./routes/items'));
app.use('/itemrelationships', require('./routes/item_relationships'));

app.use((request: any, response: any, next: any) => {
  var error: any = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error: any, request: any, response: any, next: any) => {
  debug(error.stack);
  response.status(error.status || 500);
  response.end();
});

export default app;