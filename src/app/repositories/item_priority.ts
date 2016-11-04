import { DB, IDocument } from '../db';
import { BaseRepository, Query, Update } from './base';

interface IItemPriorityDocument extends IDocument {
  title: string;
  key: string;
  order: number;
}

export class ItemPriorityRepository extends BaseRepository<IItemPriority, IItemPriorityFilter, IItemPriorityChange, IItemPriorityDocument> {
  collectionName(): string {
    return 'item_priorities';
  }

  filterToQuery(filter: IItemPriorityFilter): Query {
    var query = new Query();
    query.set('_id', filter, this.toObjectId.bind(this));

    return query;
  }

  changeToUpdate(change: IItemPriorityChange): Update {
    var update = new Update();
    update.setOrUnset('title', change.title);
    update.setOrUnset('key', change.key);

    return update;
  }

  documentToEntity(document: IItemPriorityDocument): IItemPriority {
    return {
      id: document._id.toString(),
      title: document.title,
      key: document.key,
      order: document.order
    };
  }

  entityToDocument(entity: IItemPriority): IItemPriorityDocument {
    return {
      _id: DB.ObjectId(entity.id),
      title: entity.title,
      key: entity.key,
      order: entity.order
    };
  }
}
