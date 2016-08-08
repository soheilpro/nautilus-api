import { DB, Query, Update } from '../db';
import { BaseRepository, IDocument } from './base';

interface IItemAreaDocument extends IDocument {
  title: string;
  project: IDocument;
}

export class ItemAreaRepository extends BaseRepository<IItemArea, IItemAreaFilter, IItemAreaChange, IItemAreaDocument> {
  collectionName(): string {
    return 'item_areas';
  }

  filterToQuery(filter: IItemAreaFilter): Query {
    var query = new Query();
    query.set('_id', filter, this.toObjectId.bind(this));

    return query;
  }

  changeToUpdate(change: IItemAreaChange): Update {
    var update = new Update();
    update.setOrUnset('title', change.title);
    update.setOrUnset('project', change.project, this.toRef.bind(this));

    return update;
  }

  documentToEntity(document: IItemAreaDocument): IItemArea {
    return {
      id: document._id.toString(),
      title: document.title,
      project: this.fromRef(document.project)
    };
  }

  entityToDocument(entity: IItemArea): IItemAreaDocument {
    return {
      _id: DB.ObjectId(entity.id),
      title: entity.title,
      project: this.toRef(entity.project),
    };
  }
}
