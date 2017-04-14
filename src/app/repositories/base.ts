import { DB, IDocument } from '../db';

export interface IMetaDocument extends IDocument {
  _id: any;
  meta?: {
    version?: number,
    state?: number,
    insertDateTime?: Date,
    updateDateTime?: Date,
    deleteDateTime?: Date,
  }
}

var _ = require('underscore');

export abstract class BaseRepository<TEntity extends IEntity, TFilter extends IFilter, TChange extends IChange, TDocument extends IDocument> implements IRepository<TEntity, TFilter, TChange> {
  protected db: DB;

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
    query.set('meta.state', { $lte: 1 });

    this.db.find<TDocument>(this.collectionName(), this.cleanUp(query), null, null, (error, result) => {
      if (error)
        return callback(error);

      var entities = result.map<TEntity>(this.documentToEntity.bind(this));
      callback(null, entities);
    });
  };

  get(filter: TFilter, callback: IGetCallback<TEntity>) {
    var query = this.filterToQuery(filter);
    query.set('meta.state', { $lte: 1 });

    this.db.findOne<TDocument>(this.collectionName(), this.cleanUp(query), null, (error, result) => {
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

    this.db.counter('_version', (error, version) => {
      if (error)
        return callback(error);

      (document as IMetaDocument).meta = {
        version: version,
        state: 0,
        insertDateTime: new Date()
      };

      this.db.insert(this.collectionName(), this.cleanUp(document), (error) => {
        if (error)
          return callback(error);

        var entity = this.documentToEntity(document);
        callback(null, entity);
      });
    });
  };

  update(id: string, change: TChange, callback: IUpdateCallback<TEntity>) {
    var filter: any = { id: id }; // TS bug?
    var query = this.filterToQuery(filter);
    var update = this.changeToUpdate(change);

    this.db.counter('_version', (error, version) => {
      if (error)
        return callback(error);

      update.setOrUnset('meta.version', version);
      update.setOrUnset('meta.state', 1);
      update.setOrUnset('meta.updateDateTime', new Date());

      this.db.findAndModify<TDocument>(this.collectionName(), this.cleanUp(query), this.cleanUp(update), {new: true}, (error, result) => {
        if (error)
          return callback(error);

        var entity = this.documentToEntity(result);
        callback(null, entity);
      });
    });
  };

  delete(id: string, callback: IDeleteCallback) {
    var filter: any = { id: id }; // TS bug?
    var query = this.filterToQuery(filter);

    this.db.counter('_version', (error, version) => {
      if (error)
        return callback(error);

      var update = new Update();
      update.setOrUnset('meta.version', version);
      update.setOrUnset('meta.state', 2);
      update.setOrUnset('meta.deleteDateTime', new Date());

      this.db.findAndModify<TDocument>(this.collectionName(), this.cleanUp(query), this.cleanUp(update), {new: true}, (error, result) => {
        if (error)
          return callback(error);

        var entity = this.documentToEntity(result);
        callback(null);
      });
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

  private cleanUp<T>(object: T): T {
    var result = _.clone(object);

    _.each(result, (value: any, key: string) => {
      var value = result[key];

      if (value === undefined || (_.isObject(value) && _.isEmpty(value) && !_.isDate(value)))
        delete result[key];
    });

    return result;
  }
}

export class Query {
  set(key: string, value: any, map?: (value: any) => any) {
    if (value === undefined)
      return;

    (this as any)[key] = map ? map(value) : value;
  };
}

export class Update {
  private $set: {[key: string]: any} = {};
  private $unset: {[key: string]: any} = { __noop__: '' };
  private $addToSet: {[key: string]: any} = {};
  private $pull: {[key: string]: any} = {};

  setOrUnset(key: string, value: any, map?: (value: any) => any) {
    if (value === undefined)
      return;

    if (value)
      this.$set[key] = map ? map(value) : value;
    else
      this.$unset[key] = '';
  };

  addToSet(key: string, value: any, map?: (value: any) => any) {
    if (value === undefined)
      return;

    this.$addToSet[key] = { $each: map ? map(value) : value };
  };

  removeFromSet(key: string, value: any, map?: (value: any) => any) {
    if (value === undefined)
      return;

    this.$pull[key] = { $in: map ? map(value) : value };
  };
}
