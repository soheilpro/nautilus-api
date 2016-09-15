import { v1 } from './updaters/v1'

var async = require('async');

export class Updater {
  update(callback: (error: Error) => void): void {
    var updaters = [
      new v1()
    ];

    var runners = updaters.map(updater => updater.run.bind(updater));

    async.waterfall(runners, callback);
  }
}
