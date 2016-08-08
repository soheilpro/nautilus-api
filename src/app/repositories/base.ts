import { DB, Query, Update } from '../db';

export interface IDocument {
  _id: any;
}

interface ICounterDocument extends IDocument {
  name: string;
  value: number;
}

interface IGetNextCounterCallback {
  (error: Error, value?: number): any
}

var _ = require('underscore');

export abstract class BaseRepository<TEntity extends IEntity, TFilter extends IFilter, TChange extends IChange, TDocument extends IDocument> implements IRepository<TEntity, TFilter, TChange> {
  private db: DB;

  constructor() {
    this.db = new DB();
  }

  abstract collectionName(): string;
  abstract filterToQuery(filter: TFilter): Query;
  abstract changeToUpdate(change: TChange): Update;
  abstract documentToEntity(document: TDocument): TEntity;
  abstract entityToDocument(entity: TEntity): TDocument;

  getAll(filter: TFilter, callback: IGetAllCallback<TEntity>) {
    var query = this.filterToQuery(filter);

    this.db.find<TDocument>(this.collectionName(), query.value(), null, null, (error, result) => {
      if (error)
        return callback(error);

      var entities = result.map<TEntity>(this.documentToEntity.bind(this));
      callback(null, entities);
    });
  };

  get(filter: TFilter, callback: IGetCallback<TEntity>) {
    var query = this.filterToQuery(filter);

    this.db.findOne<TDocument>(this.collectionName(), query.value(), null, (error, result) => {
      if (error)
        return callback(error);

      if (!result)
        return callback(null, null);

      var entity = this.documentToEntity(result);
      callback(null, entity);
    });
  };

  insert(entity: TEntity, callback: IInsertCallback<TEntity>) {
    var document = this.entityToDocument(entity);

    this.db.insert(this.collectionName(), document, (error) => {
      if (error)
        return callback(error);

      var entity = this.documentToEntity(document);
      callback(null, entity);
    });
  };

  update(id: string, change: TChange, callback: IUpdateCallback<TEntity>) {
    var filter: any = { id: id }; // TS bug?
    var query = this.filterToQuery(filter);
    var update = this.changeToUpdate(change);

    this.db.findAndModify<TDocument>(this.collectionName(), query.value(), update.value(), {new: true}, (error, result) => {
      if (error)
        return callback(error);

      var entity = this.documentToEntity(result);
      callback(null, entity);
    });
  };

  delete(id: string, callback: IDeleteCallback) {
    var filter: any = { id: id }; // TS bug?
    var query = this.filterToQuery(filter);

    this.db.remove(this.collectionName(), query.value(), callback);
  }

  protected getNextCounter(name: string, callback: IGetNextCounterCallback) {
    var query = { name: name };
    var update = { $inc: { value: 1 } };

    this.db.findAndModify<ICounterDocument>('counters', query, update, {new: true}, (error, result) => {
      if (error)
        return callback(error);

      callback(null, result.value);
    });
  }

  protected toRef(entity: IEntity): IDocument {
    if (!entity)
      return undefined;

    return {
      _id: DB.ObjectId(entity.id),
    };
  }

  protected toRefArray(entities: IEntity[]): IDocument[] {
    if (!entities)
      return undefined;

    var result = entities.map<IDocument>(this.toRef.bind(this));

    if (result.length === 0)
      return undefined;

    return result;
  }

  protected fromRef(document: IDocument): IEntity {
    if (!document)
      return undefined;

    return {
      id: document._id.toString()
    };
  }

  protected fromRefArray(documents: IDocument[]): IEntity[] {
    if (!documents)
      return undefined;

    var result = documents.map(this.fromRef.bind(this));

    if (result.length === 0)
      return undefined;

    return result;
  }

  protected toObjectId(object: { id: string}): any {
    if (!object)
      return undefined;

    if (!object.id)
      return undefined;

    return DB.ObjectId(object.id);
  }
}
