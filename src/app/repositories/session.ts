import { DB, Query, Update } from '../db';
import { BaseRepository, IDocument } from './base';

interface ISessionDocument extends IDocument {
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
      user: this.fromRef(document.user)
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
