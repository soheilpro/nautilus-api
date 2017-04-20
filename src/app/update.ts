import { v1 } from './updaters/v1'
import { v2 } from './updaters/v2'
import { v3 } from './updaters/v3'
import { v4 } from './updaters/v4'
import { v5 } from './updaters/v5'

var async = require('async');

var updaters = [
  new v1(),
  new v2(),
  new v3(),
  new v4(),
  new v5(),
];

var runners = updaters.map(updater => updater.run.bind(updater));

async.waterfall(runners, (error: Error) => {
  if (error) {
    console.error(error);
    process.exit(1);
  }

  console.log('Database update complete.');
  process.exit();
});
