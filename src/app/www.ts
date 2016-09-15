#!/usr/bin/env node

import config from './config';
import app from './app';
import { Updater } from './updater'

var debug = require('debug')('nautilus-api');

var updater = new Updater();

updater.update(error => {
  if (error) {
    console.log(error);
    return;
  }

  var server = app.listen(config.get('NAUTILUS_API_PORT'), () => {
    debug('Nautilus API listening on port ' + server.address().port);
  });
});
