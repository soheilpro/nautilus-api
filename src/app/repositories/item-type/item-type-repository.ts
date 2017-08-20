import { IItemType, IItemTypeFilter, IItemTypeChange, IItemTypeRepository } from '../../framework/item-type';
import { IDB } from '../../db';
import { IItemTypeDocument } from './iitem-type-document';
import RepositoryBase from '../repository-base';

export class ItemTypeRepository extends RepositoryBase<IItemType, IItemTypeFilter, IItemTypeChange, IItemTypeDocument> implements IItemTypeRepository {
  constructor(db: IDB) {
    super(db);
  }

  collectionName() {
    return 'item_types';
  }

  changeToUpdate(change: IItemTypeChange) {
    const update = super.changeToUpdate(change);
    update.setOrUnset('itemKind', change.itemKind);
    update.setOrUnset('title', change.title);
    update.setOrUnset('key', change.key);
    update.setOrUnset('order', change.order);

    return update;
  }

  documentToEntity(document: IItemTypeDocument) {
    return {
      ...super.documentToEntity(document),
      itemKind: document.itemKind,
      title: document.title,
      key: document.key,
      order: document.order,
    };
  }

  entityToDocument(entity: IItemType) {
    return {
      ...super.entityToDocument(entity),
      itemKind: entity.itemKind,
      title: entity.title,
      key: entity.key,
      order: entity.order,
    };
  }
}
