import { DB, Query, Update } from '../db';
import { BaseRepository, IDocument } from './base';

interface IStateDocument extends IDocument {
  title: string;
  type: string;
  color: string;
}

export class StateRepository extends BaseRepository<IState, IStateFilter, IStateChange, IStateDocument> {
  collectionName(): string {
    return 'states';
  }

  filterToQuery(filter: IStateFilter): Query {
    var query = new Query();
    query.set('_id', filter.id, DB.ObjectId.bind(this));

    return query;
  }

  changeToUpdate(change: IStateChange): Update {
    var update = new Update();
    update.setOrUnset('title', change.title);
    update.setOrUnset('type', change.type);
    update.setOrUnset('color', change.color);

    return update;
  }

  documentToEntity(document: IStateDocument): IState {
    return {
      id: document._id.toString(),
      title: document.title,
      type: document.type,
      color: document.color
    };
  }

  entityToDocument(entity: IState): IStateDocument {
    return {
      _id: DB.ObjectId(entity.id),
      title: entity.title,
      type: entity.type,
      color: entity.color,
    };
  }
}
