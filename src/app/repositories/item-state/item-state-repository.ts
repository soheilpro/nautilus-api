import { IItemState, IItemStateFilter, IItemStateChange, IItemStateRepository } from '../../framework/item-state';
import { IDB } from '../../db';
import { IItemStateDocument } from './iitem-state-document';
import RepositoryBase from '../repository-base';

export class ItemStateRepository extends RepositoryBase<IItemState, IItemStateFilter, IItemStateChange, IItemStateDocument> implements IItemStateRepository {
  constructor(db: IDB) {
    super(db);
  }

  collectionName() {
    return 'item_states';
  }

  changeToUpdate(change: IItemStateChange) {
    const update = super.changeToUpdate(change);
    update.setOrUnset('itemKind', change.itemKind);
    update.setOrUnset('title', change.title);
    update.setOrUnset('key', change.key);
    update.setOrUnset('order', change.order);

    return update;
  }

  documentToEntity(document: IItemStateDocument) {
    return {
      ...super.documentToEntity(document),
      itemKind: document.itemKind,
      title: document.title,
      key: document.key,
      order: document.order,
    };
  }

  entityToDocument(entity: IItemState) {
    return {
      ...super.entityToDocument(entity),
      itemKind: entity.itemKind,
      title: entity.title,
      key: entity.key,
      order: entity.order,
    };
  }
}
