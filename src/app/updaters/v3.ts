import { BaseUpdater } from './base'
import { IDocument } from '../db'

var async = require('async');

export class v3 extends BaseUpdater {
  getVersion(): number {
    return 3;
  }

  getTasks(): Function[] {
    var tasks: Function[] = [];

    tasks.push(this.addMetaInserts.bind(this,'items'));
    tasks.push(this.addMetaInserts.bind(this,'item_areas'));
    tasks.push(this.addMetaInserts.bind(this,'item_priorities'));
    tasks.push(this.addMetaInserts.bind(this,'item_states'));
    tasks.push(this.addMetaInserts.bind(this,'item_types'));
    tasks.push(this.addMetaInserts.bind(this,'projects'));
    tasks.push(this.addMetaInserts.bind(this,'sessions'));
    tasks.push(this.addMetaInserts.bind(this,'users'));
    tasks.push(this.addMetaInserts.bind(this,'user_logs'));
    tasks.push(this.addMetaInserts.bind(this,'user_roles'));

    tasks.push((callback: (error: Error) => void) => {
      var query = {
        'action': 'items.update'
      };

      this.db.find<IDocument>('user_logs', query, {}, {}, (error, documents) => {
        if (error)
          return callback(error);

        async.each(documents, (document: IDocument, callback: (error: Error) => void) => {
          var query = {
            _id: (document as any).item._id
          };

          var update = {
            $set: {
              'meta.state': 1,
              'meta.updateDateTime': document._id.getTimestamp()
            }
          }

          this.db.update('items', query, update, {}, callback);
        }, callback);
      });
    });

    tasks.push((callback: (error: Error) => void) => {
      var document = {
        name: "_version",
        value: 0
      };

      this.db.insert('counters', document, callback);
    });

    return tasks;
  }

  private addMetaInserts(collection: string, callback: (error: Error) => void) {
    this.db.find<IDocument>(collection, {}, {}, {}, (error, documents) => {
      if (error)
        return callback(error);

      async.each(documents, (document: IDocument, callback: (error: Error) => void) => {
        var query = {
          _id: document._id
        };

        var update = {
          $set: {
            'meta.version': 0,
            'meta.state': 0,
            'meta.insertDateTime': document._id.getTimestamp()
          }
        }

        this.db.update(collection, query, update, {}, callback);
      }, callback);
    });
  }
}
