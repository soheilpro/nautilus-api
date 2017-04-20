import { DB, IDocument } from '../db';

var async = require('async');

interface IUpdater {
  run(callback: (error: Error) => void): void;
}

interface IMetaDocument extends IDocument {
  version: number;
}

export abstract class BaseUpdater implements IUpdater {
  protected db: DB;

  constructor() {
    this.db = new DB();
  }

  abstract getVersion(): number;

  abstract getTasks(): Function[];

  protected update(callback: (error: Error) => void): void {
    var tasks = this.getTasks().map(task => task.bind(this));

    async.waterfall(tasks, callback);
  }

  run(callback: (error: Error) => void) {
    this.db.findOne<IMetaDocument>('meta', {}, {}, (error, meta) => {
      if (error)
        return callback(error);

      var currentVersion = meta ? (meta.version || 0) : 0;
      var targetVersion = this.getVersion();

      if (currentVersion >= targetVersion)
        return callback(null);

      this.update(error => {
        if (error)
          return callback(error);

        this.db.update('meta', {}, { $set: { version: targetVersion } }, { upsert: true }, error => {
          if (error)
            return callback(error);

          console.log('Updated database to version ' + targetVersion + '.');

          callback(null);
        });
      });
    });
  }
}
