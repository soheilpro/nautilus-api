import { DB, IDocument } from '../db';
import { BaseRepository, Query, Update } from './base';

interface IUserDocument extends IDocument {
  username: string;
  passwordHash: string;
  name: string;
}

export class UserRepository extends BaseRepository<IUser, IUserFilter, IUserChange, IUserDocument> {
  collectionName(): string {
    return 'users';
  }

  filterToQuery(filter: IUserFilter): Query {
    var query = new Query();
    query.set('_id', filter, this.toObjectId.bind(this));
    query.set('username', filter.username);

    return query;
  }

  changeToUpdate(change: IUserChange): Update {
    var update = new Update();
    update.setOrUnset('username', change.username);
    update.setOrUnset('passwordHash', change.passwordHash);
    update.setOrUnset('name', change.name);

    return update;
  }

  documentToEntity(document: IUserDocument): IUser {
    return {
      id: document._id.toString(),
      username: document.username,
      passwordHash: document.passwordHash,
      name: document.name
    };
  }

  entityToDocument(entity: IUser): IUserDocument {
    return {
      _id: DB.ObjectId(entity.id),
      username: entity.username,
      passwordHash: entity.passwordHash,
      name: entity.name
    };
  }
}
