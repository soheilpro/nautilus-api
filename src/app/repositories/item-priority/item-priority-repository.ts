import { IItemPriority, IItemPriorityFilter, IItemPriorityChange, IItemPriorityRepository } from '../../framework/item-priority';
import { IDB } from '../../db';
import { IItemPriorityDocument } from './iitem-priority-document';
import RepositoryBase from '../repository-base';

export class ItemPriorityRepository extends RepositoryBase<IItemPriority, IItemPriorityFilter, IItemPriorityChange, IItemPriorityDocument> implements IItemPriorityRepository {
  constructor(db: IDB) {
    super(db);
  }

  collectionName() {
    return 'item_priorities';
  }

  changeToUpdate(change: IItemPriorityChange) {
    const update = super.changeToUpdate(change);
    update.setOrUnset('itemKind', change.itemKind);
    update.setOrUnset('title', change.title);
    update.setOrUnset('key', change.key);
    update.setOrUnset('order', change.order);

    return update;
  }

  documentToEntity(document: IItemPriorityDocument) {
    return {
      ...super.documentToEntity(document),
      itemKind: document.itemKind,
      title: document.title,
      key: document.key,
      order: document.order,
    };
  }

  entityToDocument(entity: IItemPriority) {
    return {
      ...super.entityToDocument(entity),
      itemKind: entity.itemKind,
      title: entity.title,
      key: entity.key,
      order: entity.order,
    };
  }
}
