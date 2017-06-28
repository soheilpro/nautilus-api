import { IUserRole, IUserRoleFilter, IUserRoleChange, IUserRoleRepository } from '../../framework/user-role';
import { IDB } from '../../db';
import { IUserRoleDocument } from './iuser-role-document';
import RepositoryBase from '../repository-base';

export class UserRoleRepository extends RepositoryBase<IUserRole, IUserRoleFilter, IUserRoleChange, IUserRoleDocument> implements IUserRoleRepository {
  constructor(db: IDB) {
    super(db);
  }

  collectionName() {
    return 'user_roles';
  }

  documentToEntity(document: IUserRoleDocument) {
    return {
      ...super.documentToEntity(document),
      user: this.fromRef(document.user),
      project: this.fromRef(document.project),
      name: document.name,
      meta: document.meta,
    };
  }

  entityToDocument(entity: IUserRole) {
    return {
      ...super.entityToDocument(entity),
      user: this.toRef(entity.user),
      project: this.toRef(entity.project),
      name: entity.name,
    };
  }
}
