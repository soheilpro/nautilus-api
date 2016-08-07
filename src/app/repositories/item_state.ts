import { DB, Query, Update } from '../db';
import { BaseRepository, IDocument } from './base';

interface IItemStateDocument extends IDocument {
  title: string;
  type: string;
  color: string;
}

export class ItemStateRepository extends BaseRepository<IItemState, IItemStateFilter, IItemStateChange, IItemStateDocument> {
  collectionName(): string {
    return 'item_states';
  }

  filterToQuery(filter: IItemStateFilter): Query {
    var query = new Query();
    query.set('_id', filter, this.toObjectId.bind(this));

    return query;
  }

  changeToUpdate(change: IItemStateChange): Update {
    var update = new Update();
    update.setOrUnset('title', change.title);
    update.setOrUnset('type', change.type);
    update.setOrUnset('color', change.color);

    return update;
  }

  documentToEntity(document: IItemStateDocument): IItemState {
    return {
      id: document._id.toString(),
      title: document.title,
      type: document.type,
      color: document.color
    };
  }

  entityToDocument(entity: IItemState): IItemStateDocument {
    return {
      _id: DB.ObjectId(entity.id),
      title: entity.title,
      type: entity.type,
      color: entity.color,
    };
  }
}
