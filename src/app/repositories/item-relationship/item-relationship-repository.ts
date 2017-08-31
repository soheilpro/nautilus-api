import { IItemRelationship, IItemRelationshipFilter, IItemRelationshipChange, IItemRelationshipRepository } from '../../framework/item-relationship';
import { IDB } from '../../db';
import { IItemRelationshipDocument } from './iitem-relationship-document';
import RepositoryBase from '../repository-base';

export class ItemRelationshipRepository extends RepositoryBase<IItemRelationship, IItemRelationshipFilter, IItemRelationshipChange, IItemRelationshipDocument> implements IItemRelationshipRepository {
  constructor(db: IDB) {
    super(db);
  }

  collectionName() {
    return 'itemRelationships';
  }

  changeToUpdate(change: IItemRelationshipChange) {
    const update = super.changeToUpdate(change);
    update.setOrUnset('item1', change.item1, this.toRef);
    update.setOrUnset('item2', change.item2, this.toRef);
    update.setOrUnset('type', change.type);

    return update;
  }

  documentToEntity(document: IItemRelationshipDocument) {
    return {
      ...super.documentToEntity(document),
      item1: this.fromRef(document.item1),
      item2: this.fromRef(document.item2),
      type: document.type,
    };
  }

  entityToDocument(entity: IItemRelationship) {
    return {
      ...super.entityToDocument(entity),
      item1: this.toRef(entity.item1),
      item2: this.toRef(entity.item2),
      type: entity.type,
    };
  }
}
