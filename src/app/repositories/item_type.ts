import { DB, Query, Update } from '../db';
import { BaseRepository, IDocument } from './base';

interface IItemTypeDocument extends IDocument {
  title: string;
  key: string;
}

export class ItemTypeRepository extends BaseRepository<IItemType, IItemTypeFilter, IItemTypeChange, IItemTypeDocument> {
  collectionName(): string {
    return 'item_types';
  }

  filterToQuery(filter: IItemTypeFilter): Query {
    var query = new Query();
    query.set('_id', filter, this.toObjectId.bind(this));

    return query;
  }

  changeToUpdate(change: IItemTypeChange): Update {
    var update = new Update();
    update.setOrUnset('title', change.title);
    update.setOrUnset('key', change.key);

    return update;
  }

  documentToEntity(document: IItemTypeDocument): IItemType {
    return {
      id: document._id.toString(),
      title: document.title,
      key: document.key
    };
  }

  entityToDocument(entity: IItemType): IItemTypeDocument {
    return {
      _id: DB.ObjectId(entity.id),
      title: entity.title,
      key: entity.key
    };
  }
}
