#!/usr/bin/env node

var debug = require('debug')('odin-api');
var app = require('./app');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('Odin API listening on port ' + server.address().port);
});
