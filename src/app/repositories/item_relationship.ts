import { DB, IDocument } from '../db';
import { BaseRepository, Query, Update, IMetaDocument } from './base';

interface IItemRelationshipDocument extends IMetaDocument {
  item1: IDocument;
  item2: IDocument;
  type: string;
}

export class ItemRelationshipRepository extends BaseRepository<IItemRelationship, IItemRelationshipFilter, IItemRelationshipChange, IItemRelationshipDocument> {
  collectionName(): string {
    return 'item_relationships';
  }

  filterToQuery(filter: IItemRelationshipFilter): Query {
    var query = new Query();
    query.set('_id', filter, this.toObjectId.bind(this));

    if (filter.items) {
      query.set('$or', [
        { 'item1._id': { $in: filter.items.map(this.toObjectId.bind(this)) } },
        { 'item2._id': { $in: filter.items.map(this.toObjectId.bind(this)) } },
      ]);
    }

    return query;
  }

  changeToUpdate(change: IItemRelationshipChange): Update {
    var update = new Update();

    return update;
  }

  documentToEntity(document: IItemRelationshipDocument): IItemRelationship {
    return {
      id: document._id.toString(),
      item1: this.fromRef(document.item1),
      item2: this.fromRef(document.item2),
      type: document.type,
      meta: document.meta,
    };
  }

  entityToDocument(entity: IItemRelationship): IItemRelationshipDocument {
    return {
      _id: DB.ObjectId(entity.id),
      item1: this.toRef(entity.item1),
      item2: this.toRef(entity.item2),
      type: entity.type
    };
  }
}
