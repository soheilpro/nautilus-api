import { ISchema } from './ischema';
import { IDB, IDocument } from '../db';

// tslint:disable-next-line:class-name
export class v1 implements ISchema {
  readonly version = 1;

  async apply(db: IDB) {
    const versionCounter: IDocument = {
      'name': '_version',
      'value': 0,
    };

    await db.insert('counter', versionCounter);

    let adminUser: IDocument = {
      'name': 'Admin',
      'username': 'admin',
      'passwordHash': '$2a$10$WlTsJ5UA3uC0mr6k4v9qN.uzXVRgGG08gNAqGGZctK7ioaIGoHPeu',
    };

    adminUser = await db.insertManaged('users', adminUser);

    const adminUserRole = {
      'user': {
        '_id': adminUser._id,
      },
      'name': 'admin',
    };

    await db.insertManaged('user_roles', adminUserRole);
  }
}
