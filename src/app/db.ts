import config from './config';

var mongodb = require('mongodb');
var _ = require('underscore');

export class DB {
  private static _db: any;

  opendb(callback: (error: Error, db?: any) => void): void {
    if (DB._db)
      return callback(null, DB._db);

    mongodb.MongoClient.connect(config.get('NAUTILUS_API_DB_ADDRESS'), (error: Error, db?: any) => {
      if (error)
        return callback(error);

      DB._db = db;

      callback(null, db);
    });
  }

  collection(collectionName: string, callback: (error: Error, collection?: any, finalizer?: () => void) => void): void {
    this.opendb((error, db) => {
      if (error)
        return callback(error);

      db.collection(collectionName, (error: Error, collection: any) => {
        if (error)
          return callback(error);

        callback(null, collection, () => {});
      });
    });
  }

  insert<TDocument>(collectionName: string, document: TDocument, callback: (error: Error) => void) {
    this.collection(collectionName, (error, collection, finalizer) => {
      if (error)
        return callback(error);

      collection.insert(this.cleanUp(document), (error: Error) => {
        finalizer();

        if (callback)
          callback(error);
      });
    });
  }

  update(collectionName: string, query: Object, update: Object, options: Object, callback: (error: Error) => void) {
    this.collection(collectionName, (error, collection, finalizer) => {
      if (error)
        return callback(error);

      collection.update(this.cleanUp(query), this.cleanUp(update), options, (error: Error) => {
        finalizer();

        if (callback)
          callback(error);
      });
    });
  }

  findAndModify<TDocument>(collectionName: string, query: Object, update: Object, options: Object, callback: (error: Error, result?: TDocument) => void) {
    this.collection(collectionName, (error, collection, finalizer) => {
      if (error)
        return callback(error);

      collection.findAndModify(this.cleanUp(query), [], this.cleanUp(update), options, (error: Error, result: {value: TDocument}) => {
        finalizer();

        if (callback)
          callback(error, result ? result.value : null);
      });
    });
  }

  remove(collectionName: string, query: Object, callback: (error: Error) => void) {
    this.collection(collectionName, (error, collection, finalizer) => {
      if (error)
        return callback(error);

      collection.remove(this.cleanUp(query), (error: Error) => {
        finalizer();

        if (callback)
          callback(error);
      });
    });
  }

  find<TDocument>(collectionName: string, query: Object, fields: Object, options: Object, callback: (error: Error, result?: TDocument[]) => void) {
    this.collection(collectionName, (error, collection, finalizer) => {
      if (error)
        return callback(error);

      collection.find(this.cleanUp(query), fields || {}, options).toArray((error: Error, result: TDocument[]) => {
        finalizer();
        callback(error, result);
      });
    });
  }

  findOne<TDocument>(collectionName: string, query: Object, fields: Object, callback: (error: Error, result?: TDocument) => void) {
    this.collection(collectionName, (error, collection, finalizer) => {
      if (error)
        return callback(error);

      collection.findOne(this.cleanUp(query), fields || {}, (error: Error, result: TDocument) => {
        finalizer();
        callback(error, result);
      });
    });
  }

  count(collectionName: string, query: Object, callback: (error: Error, count?: number) => void) {
    this.collection(collectionName, (error, collection, finalizer) => {
      if (error)
        return callback(error);

      collection.count(this.cleanUp(query), (error: Error, count: number) => {
        finalizer();
        callback(error, count);
      });
    });
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

  static ObjectId(id: string): Object {
    return mongodb.ObjectId(id);
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
