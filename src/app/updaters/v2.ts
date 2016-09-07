import { BaseUpdater } from './base'
import { IDocument } from '../db'

export class v2 extends BaseUpdater {
  getVersion(): number {
    return 2;
  }

  getTasks(): Function[] {
    var tasks: Function[] = [];

    tasks.push((callback: (error: Error) => void) => {
      this.db.findOne<IDocument>('users', { username: 'admin' }, {}, (error, user) => {
        if (error)
          return callback(error);

        var document = {
          user: {
            _id: user._id
          },
          name: 'admin'
        };

        this.db.insert('user_roles', document, callback);
      });
    });

    return tasks;
  }
}
