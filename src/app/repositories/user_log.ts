import { DB, IDocument } from '../db';
import { BaseRepository, Query, Update, IMetaDocument } from './base';

interface IUserLogDocument extends IMetaDocument {
  dateTime: Date;
  user: IDocument;
  action: string;
  item: IDocument;
  params: any
}

export class UserLogRepository extends BaseRepository<IUserLog, IUserLogFilter, IUserLogChange, IUserLogDocument> {
  collectionName(): string {
    return 'user_logs';
  }

  filterToQuery(filter: IUserLogFilter): Query {
    var query = new Query();
    query.set('_id', filter, this.toObjectId.bind(this));

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
      item: this.fromRef(document.item),
      params: document.params,
      meta: document.meta,
    };
  }

  entityToDocument(entity: IUserLog): IUserLogDocument {
    return {
      _id: DB.ObjectId(entity.id),
      dateTime: entity.dateTime,
      user: this.toRef(entity.user),
      action: entity.action,
      item: this.toRef(entity.item),
      params: entity.params
    };
  }
}
