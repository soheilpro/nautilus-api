import { DB, Query, Update } from '../db';
import { BaseRepository, IDocument } from './base';

interface ISessionDocument extends IDocument {
  user: IDocument;
}

export class SessionRepository extends BaseRepository<ISession, ISessionFilter, ISessionChange, ISessionDocument> {
  collectionName(): string {
    return 'sessions';
  }

  filterToQuery(filter: ISessionFilter): Query {
    var query = new Query();
    query.set('_id', filter.id);

    return query;
  }

  changeToUpdate(change: ISessionChange): Update {
    var update = new Update();

    return update;
  }

  documentToEntity(document: ISessionDocument): ISession {
    return {
      id: document._id,
      user: this.fromRef(document.user)
    };
  }

  entityToDocument(entity: ISession): ISessionDocument {
    return {
      _id: entity.id,
      user: this.toRef(entity.user)
    };
  }
}
