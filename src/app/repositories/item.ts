import { DB, IDocument } from '../db';
import { BaseRepository, Query, Update } from './base';

interface IItemDocument extends IDocument {
  sid: string;
  type: IDocument;
  title: string;
  description: string;
  state: IDocument;
  priority: IDocument;
  project: IDocument;
  parent: IDocument;
  assignedTo: IDocument;
  createdBy: IDocument;
  modifiedBy: IDocument;
}

export class ItemRepository extends BaseRepository<IItem, IItemFilter, IItemChange, IItemDocument> {
  collectionName(): string {
    return 'items';
  }

  filterToQuery(filter: IItemFilter): Query {
    var query = new Query();
    query.set('_id', filter, this.toObjectId.bind(this));
    query.set('type._id', filter.type, this.toObjectId.bind(this));

    return query;
  }

  changeToUpdate(change: IItemChange): Update {
    var update = new Update();
    update.setOrUnset('type', change.type, this.toRef.bind(this));
    update.setOrUnset('title', change.title);
    update.setOrUnset('description', change.description);
    update.setOrUnset('state', change.state, this.toRef.bind(this));
    update.setOrUnset('priority', change.priority, this.toRef.bind(this));
    update.setOrUnset('project', change.project, this.toRef.bind(this));
    update.setOrUnset('parent', change.parent, this.toRef.bind(this));
    update.setOrUnset('assignedTo', change.assignedTo, this.toRef.bind(this));

    return update;
  }

  documentToEntity(document: IItemDocument): IItem {
    return {
      id: document._id.toString(),
      sid: document.sid,
      type: this.fromRef(document.type),
      title: document.title,
      description: document.description,
      state: this.fromRef(document.state),
      priority: this.fromRef(document.priority),
      project: this.fromRef(document.project),
      parent: this.fromRef(document.parent),
      assignedTo: this.fromRef(document.assignedTo),
      createdBy: this.fromRef(document.createdBy),
      modifiedBy: this.fromRef(document.modifiedBy)
    };
  }

  entityToDocument(entity: IItem): IItemDocument {
    return {
      _id: DB.ObjectId(entity.id),
      sid: entity.sid,
      type: this.toRef(entity.type),
      title: entity.title,
      description: entity.description,
      state: this.toRef(entity.state),
      priority: this.toRef(entity.priority),
      project: this.toRef(entity.project),
      parent: this.toRef(entity.parent),
      assignedTo: this.toRef(entity.assignedTo),
      createdBy: this.toRef(entity.createdBy),
      modifiedBy: this.toRef(entity.modifiedBy)
    };
  }

  insert(entity: IItem, callback: IInsertCallback<IItem>) {
    this.db.counter('items', (error, value) => {
      if (error)
        return callback(error);

      entity.sid = value.toString();

      super.insert(entity, callback);
    });
  }
}
