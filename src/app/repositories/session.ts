import { DB, IDocument } from '../db';
import { BaseRepository, Query, Update, IMetaDocument } from './base';

interface ISessionDocument extends IMetaDocument {
  accessToken: string;
  user: IDocument;
}

export class SessionRepository extends BaseRepository<ISession, ISessionFilter, ISessionChange, ISessionDocument> {
  collectionName(): string {
    return 'sessions';
  }

  filterToQuery(filter: ISessionFilter): Query {
    var query = new Query();
    query.set('_id', filter, this.toObjectId.bind(this));
    query.set('accessToken', filter.accessToken);

    return query;
  }

  changeToUpdate(change: ISessionChange): Update {
    var update = new Update();

    return update;
  }

  documentToEntity(document: ISessionDocument): ISession {
    return {
      id: document._id.toString(),
      accessToken: document.accessToken,
      user: this.fromRef(document.user),
      meta: document.meta,
    };
  }

  entityToDocument(entity: ISession): ISessionDocument {
    return {
      _id: DB.ObjectId(entity.id),
      accessToken: entity.accessToken,
      user: this.toRef(entity.user)
    };
  }
}
