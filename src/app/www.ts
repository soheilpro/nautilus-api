#!/usr/bin/env node

import config from './config';
import app from './app';

var debug = require('debug')('nautilus-api');

var server = app.listen(config.get('NAUTILUS_API_PORT'), () => {
  debug('Nautilus API listening on port ' + server.address().port);
});
