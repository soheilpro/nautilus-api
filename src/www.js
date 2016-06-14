#!/usr/bin/env node

var debug = require('debug')('nautilus-api');
var config = require('./config');
var app = require('./app');

var server = app.listen(config.get('port'), function() {
  debug('Nautilus API listening on port ' + server.address().port);
});
