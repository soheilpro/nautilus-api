import { BaseUpdater } from './base'
import { DB, IDocument } from '../db'

var async = require('async');

export class v5 extends BaseUpdater {
  getVersion(): number {
    return 5;
  }

  getTasks(): Function[] {
    var tasks: Function[] = [];

    // projects
    tasks.push((callback: (error: Error) => void) => {
      var query = {};

      var update = {
        $unset: {
          'group': '',
        }
      };

      this.db.update('projects', query, update, { multi: true }, callback);
    });

    // item_areas
    tasks.push((callback: (error: Error) => void) => {
      this.db.drop('item_areas', callback);
    });

    // item_states
    tasks.push((callback: (error: Error) => void) => {
      var query = {};

      var update = {
        $rename: {
          'type': 'key',
        },
        $set: {
          'itemKind': 'issue',
          'order': 0,
        },
      };

      this.db.update('item_states', query, update, { multi: true }, callback);
    });

    // item_priorities
    tasks.push((callback: (error: Error) => void) => {
      var query = {};

      var update = {
        $set: {
          'itemKind': 'issue',
          'order': 0,
        },
      };

      this.db.update('item_priorities', query, update, { multi: true }, callback);
    });

    tasks.push((callback: (error: Error) => void) => {
      var query = {
        'key': 'high',
      };

      var update = {
        $set: {
          'key': 'important',
          'title': 'Important',
        },
      };

      this.db.update('item_priorities', query, update, { multi: true }, callback);
    });

    // item_types
    tasks.push((callback: (error: Error) => void) => {
      var query = {};

      var update = {
        $set: {
          'itemKind': 'issue',
          'order': 0,
        },
      };

      this.db.update('item_types', query, update, { multi: true }, callback);
    });

    tasks.push((callback: (error: Error) => void) => {
      var query = {
        '_id': DB.ObjectId('57a96acce84e8b000f80bde5'),
      };

      var update = {
        $set: {
          'key': 'task',
        },
      };

      this.db.update('item_types', query, update, {}, callback);
    });

    tasks.push((callback: (error: Error) => void) => {
      var query = {
        '_id': DB.ObjectId('57a96acce84e8b000f80bde6'),
      };

      var update = {
        $set: {
          'key': 'bug',
        },
      };

      this.db.update('item_types', query, update, {}, callback);
    });

    tasks.push((callback: (error: Error) => void) => {
      var query = {
        '_id': DB.ObjectId('57a96acce84e8b000f80bde7'),
      };

      var update = {
        $set: {
          'key': 'feature',
        },
      };

      this.db.update('item_types', query, update, {}, callback);
    });

    tasks.push((callback: (error: Error) => void) => {
      var query = {
        '_id': DB.ObjectId('57a96acce84e8b000f80bde8'),
      };

      var update = {
        $set: {
          'key': 'enhancement',
        },
      };

      this.db.update('item_types', query, update, {}, callback);
    });

    tasks.push((callback: (error: Error) => void) => {
      var query = {
        '_id': DB.ObjectId('57a96acce84e8b000f80bde4'),
      };

      this.db.remove('item_types', query, callback);
    });

    // items
    tasks.push((callback: (error: Error) => void) => {
      var query = {};

      var update = {
        $rename: {
          'creator': 'createdBy',
        },
      };

      this.db.update('items', query, update, { multi: true }, callback);
    });

    tasks.push((callback: (error: Error) => void) => {
      var query = {
        'assignedUsers': {
          $exists: true,
        },
      };

      this.db.find<IDocument>('items', query, {}, {}, (error, items) => {
        if (error)
          return callback(error);

        async.each(items, (item: any, callback: (error: Error) => void) => {
          var query = {
            _id: item._id,
          };

          var update = {
            $set: {
              'assignedTo': item.assignedUsers[0],
            },
            $unset: {
              'assignedUsers': '',
            }
          };

          this.db.update('items', query, update, {}, callback);
        }, callback);
      });
    });

    tasks.push((callback: (error: Error) => void) => {
      var query = {};

      this.db.find<IDocument>('items', query, {}, {}, (error, items) => {
        if (error)
          return callback(error);

        async.each(items, (item: any, callback: (error: Error) => void) => {
          var query = {
            _id: item._id,
          };

          if (item.type && item.type._id.equals(DB.ObjectId('57a96acce84e8b000f80bde4'))) { // Milestone
            let update = {
              $set: {
                'kind': 'milestone',
              },
              $unset: {
                'type': '',
              },
            };

            this.db.update('items', query, update, {}, callback);
          }
          else {
            let update = {
              $set: {
                'kind': 'issue',
              },
            };

            this.db.update('items', query, update, {}, callback);
          }
        }, callback);
      });
    });

    tasks.push((callback: (error: Error) => void) => {
      var query = {};

      this.db.find<IDocument>('items', query, {}, {}, (error, items) => {
        if (error)
          return callback(error);

        async.each(items, (item: any, callback: (error: Error) => void) => {
          async.each(item.subItems, (subItem: any, callback: (error: Error) => void) => {
            var query = {
              _id: subItem._id,
            };

            var update = {
              $set: {
                'parent': {
                  _id: item._id,
                },
              },
            };

            this.db.update('items', query, update, {}, callback);
          }, callback);
        }, callback);
      });
    });

    tasks.push((callback: (error: Error) => void) => {
      var query = {};

      var update = {
        $unset: {
          'subItems': '',
        },
      };

      this.db.update('items', query, update, { multi: true }, callback);
    });

    return tasks;
  }
}
