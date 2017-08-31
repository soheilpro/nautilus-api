import { ISchema } from './ischema';
import { IDB, IDocument } from '../db';

// tslint:disable-next-line:class-name
export class v1 implements ISchema {
  readonly version = 1;

  async apply(db: IDB) {
    await db.insert('counters', {
      'name': '*.meta.version',
      'value': 0,
    });

    const adminUser: IDocument = await db.insertManaged('users', {
      'name': 'Admin',
      'username': 'admin',
      'passwordHash': '$2a$10$WlTsJ5UA3uC0mr6k4v9qN.uzXVRgGG08gNAqGGZctK7ioaIGoHPeu',
    });

    await db.insertManaged('userRoles', {
      'user': {
        '_id': adminUser._id,
      },
      'name': 'admin',
    });

    await db.insertManaged('itemTypes', {
      'key': 'task',
      'itemKind': 'issue',
      'title': 'Task',
      'order': 1,
    });

    await db.insertManaged('itemTypes', {
      'key': 'bug',
      'itemKind': 'issue',
      'title': 'Bug',
      'order': 2,
    });

    await db.insertManaged('itemTypes', {
      'key': 'feature',
      'itemKind': 'issue',
      'title': 'Feature',
      'order': 3,
    });

    await db.insertManaged('itemTypes', {
      'key': 'enhancement',
      'itemKind': 'issue',
      'title': 'Enhancement',
      'order': 4,
    });

    await db.insertManaged('itemStates', {
      'key': 'planned',
      'itemKind': 'milestone',
      'title': 'Planned',
      'order': 1,
    });

    await db.insertManaged('itemStates', {
      'key': 'inprogress',
      'itemKind': 'milestone',
      'title': 'In Progress',
      'order': 2,
    });

    await db.insertManaged('itemStates', {
      'key': 'finished',
      'itemKind': 'milestone',
      'title': 'Finished',
      'order': 3,
    });

    await db.insertManaged('itemStates', {
      'key': 'closed',
      'itemKind': 'milestone',
      'title': 'Closed',
      'order': 4,
    });

    await db.insertManaged('itemStates', {
      'key': 'todo',
      'itemKind': 'issue',
      'title': 'To Do',
      'order': 1,
    });

    await db.insertManaged('itemStates', {
      'key': 'doing',
      'itemKind': 'issue',
      'title': 'Doing',
      'order': 2,
    });

    await db.insertManaged('itemStates', {
      'key': 'done',
      'itemKind': 'issue',
      'title': 'Done',
      'order': 3,
    });

    await db.insertManaged('itemStates', {
      'key': 'closed',
      'itemKind': 'issue',
      'title': 'Closed',
      'order': 4,
    });
  }
}
