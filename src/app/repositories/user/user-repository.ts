import { IUser, IUserFilter, IUserChange, IUserRepository } from '../../framework/user';
import { IDB, Query, Update, ObjectId } from '../../db';
import { IUserDocument } from './iuser-document';
import RepositoryBase from '../repository-base';

export default class UserRepository extends RepositoryBase<IUser, IUserFilter, IUserChange, IUserDocument> implements IUserRepository {
  constructor(db: IDB) {
    super(db);
  }

  collectionName(): string {
    return 'users';
  }

  filterToQuery(filter: IUserFilter) {
    const query = new Query();
    query.set('_id', filter, this.toObjectId);
    query.set('username', filter.username);

    return query;
  }

  changeToUpdate(change: IUserChange) {
    const update = new Update();
    update.setOrUnset('username', change.username);
    update.setOrUnset('passwordHash', change.passwordHash);
    update.setOrUnset('name', change.name);
    update.setOrUnset('email', change.email);

    return update;
  }

  documentToEntity(document: IUserDocument) {
    return {
      id: document._id.toString(),
      username: document.username,
      passwordHash: document.passwordHash,
      name: document.name,
      email: document.email,
      meta: document.meta,
    };
  }

  entityToDocument(entity: IUser) {
    return {
      _id: new ObjectId(entity.id),
      username: entity.username,
      passwordHash: entity.passwordHash,
      name: entity.name,
      email: entity.email
    };
  }
}
