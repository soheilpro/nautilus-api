#!/usr/bin/env node

import config from './config';
import app from './app';

var debug = require('debug')('nautilus-api');

var server = app.listen(config.get('port'), () => {
  debug('Nautilus API listening on port ' + server.address().port);
});
