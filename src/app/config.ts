var path = require('path');
var nconf = require('nconf');

var config = nconf
    .env()
    .file({ file: path.join(__dirname, '../../config/app.json') })
    .defaults({
      'NAUTILUS_API_PORT': 3000,
      'NAUTILUS_API_DB_ADDRESS': 'mongodb://localhost:27017/nautilus'
    });

export default config;