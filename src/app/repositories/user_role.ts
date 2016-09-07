import { DB, IDocument } from '../db';
import { BaseRepository, Query, Update } from './base';

interface IUserRoleDocument extends IDocument {
  user: IDocument;
  project: IDocument;
  name: string;
}

export class UserRoleRepository extends BaseRepository<IUserRole, IUserRoleFilter, IUserRoleChange, IUserRoleDocument> {
  collectionName(): string {
    return 'user_roles';
  }

  filterToQuery(filter: IUserRoleFilter): Query {
    var query = new Query();
    query.set('_id', filter, this.toObjectId.bind(this));
    query.set('user._id', filter.user, this.toObjectId.bind(this));
    query.set('project._id', filter.project, this.toObjectId.bind(this));

    return query;
  }

  changeToUpdate(change: IUserRoleChange): Update {
    var update = new Update();
    update.setOrUnset('user', change.user, this.toRef.bind(this));
    update.setOrUnset('project', change.project, this.toRef.bind(this));
    update.setOrUnset('name', change.name);

    return update;
  }

  documentToEntity(document: IUserRoleDocument): IUserRole {
    return {
      id: document._id.toString(),
      user: this.fromRef(document.user),
      project: this.fromRef(document.project),
      name: document.name
    };
  }

  entityToDocument(entity: IUserRole): IUserRoleDocument {
    return {
      _id: DB.ObjectId(entity.id),
      user: this.toRef(entity.user),
      project: this.toRef(entity.project),
      name: entity.name
    };
  }
}
