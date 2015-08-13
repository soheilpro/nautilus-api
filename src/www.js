#!/usr/bin/env node

var debug = require('debug')('odin-api');
var config = require('./config');
var app = require('./app');

var server = app.listen(config.get('port'), function() {
  debug('Odin API listening on port ' + server.address().port);
});
