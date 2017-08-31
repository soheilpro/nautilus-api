import { IUser, IUserFilter, IUserChange, IUserRepository } from '../../framework/user';
import { IDB } from '../../db';
import { IUserDocument } from './iuser-document';
import RepositoryBase from '../repository-base';

export class UserRepository extends RepositoryBase<IUser, IUserFilter, IUserChange, IUserDocument> implements IUserRepository {
  constructor(db: IDB) {
    super(db);
  }

  collectionName() {
    return 'users';
  }

  changeToUpdate(change: IUserChange) {
    const update = super.changeToUpdate(change);
    update.setOrUnset('username', change.username);
    update.setOrUnset('passwordHash', change.passwordHash);
    update.setOrUnset('name', change.name);
    update.setOrUnset('email', change.email);

    return update;
  }

  documentToEntity(document: IUserDocument) {
    return {
      ...super.documentToEntity(document),
      username: document.username,
      passwordHash: document.passwordHash,
      name: document.name,
      email: document.email,
    };
  }

  entityToDocument(entity: IUser) {
    return {
      ...super.entityToDocument(entity),
      username: entity.username,
      passwordHash: entity.passwordHash,
      name: entity.name,
      email: entity.email,
    };
  }
}
