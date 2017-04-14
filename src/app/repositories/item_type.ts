import { DB } from '../db';
import { BaseRepository, Query, Update, IMetaDocument } from './base';

interface IItemTypeDocument extends IMetaDocument {
  itemKind: string;
  title: string;
  key: string;
  order: number;
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
    update.setOrUnset('itemKind', change.itemKind);
    update.setOrUnset('title', change.title);
    update.setOrUnset('key', change.key);

    return update;
  }

  documentToEntity(document: IItemTypeDocument): IItemType {
    return {
      id: document._id.toString(),
      itemKind: document.itemKind,
      title: document.title,
      key: document.key,
      order: document.order,
      meta: document.meta,
    };
  }

  entityToDocument(entity: IItemType): IItemTypeDocument {
    return {
      _id: DB.ObjectId(entity.id),
      itemKind: entity.itemKind,
      title: entity.title,
      key: entity.key,
      order: entity.order
    };
  }
}
