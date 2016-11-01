import { DB, IDocument } from '../db';
import { BaseRepository, Query, Update } from './base';

interface IItemStateDocument extends IDocument {
  title: string;
  key: string;
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
    update.setOrUnset('key', change.key);

    return update;
  }

  documentToEntity(document: IItemStateDocument): IItemState {
    return {
      id: document._id.toString(),
      title: document.title,
      key: document.key
    };
  }

  entityToDocument(entity: IItemState): IItemStateDocument {
    return {
      _id: DB.ObjectId(entity.id),
      title: entity.title,
      key: entity.key
    };
  }
}
