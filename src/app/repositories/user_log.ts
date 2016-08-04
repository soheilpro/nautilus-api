import { DB, Query, Update } from '../db';
import { BaseRepository, IDocument } from './base';

interface IUserLogDocument extends IDocument {
  dateTime: Date;
  user: IDocument;
  action: string;
  params: any
}

export class UserLogRepository extends BaseRepository<IUserLog, IUserLogFilter, IUserLogChange, IUserLogDocument> {
  collectionName(): string {
    return 'user_logs';
  }

  filterToQuery(filter: IUserLogFilter): Query {
    var query = new Query();
    query.set('_id', filter.id, DB.ObjectId.bind(this));

    return query;
  }

  changeToUpdate(change: IUserLogChange): Update {
    var update = new Update();

    return update;
  }

  documentToEntity(document: IUserLogDocument): IUserLog {
    return {
      id: document._id.toString(),
      dateTime: document.dateTime,
      user: this.fromRef(document.user),
      action: document.action,
      params: document.params
    };
  }

  entityToDocument(entity: IUserLog): IUserLogDocument {
    return {
      _id: DB.ObjectId(entity.id),
      dateTime: entity.dateTime,
      user: this.toRef(entity.user),
      action: entity.action,
      params: entity.params
    };
  }
}
