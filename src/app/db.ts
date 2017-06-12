import config from './config';

var mongodb = require('mongodb');

export interface IDocument {
  _id: any;
}

interface ICounterDocument extends IDocument {
  name: string;
  value: number;
}

interface ICounterCallback {
  (error: Error, value?: number): any
}

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

      collection.insert(document, (error: Error) => {
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

      collection.update(query, update, options, (error: Error) => {
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

      collection.findAndModify(query, [], update, options, (error: Error, result: {value: TDocument}) => {
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

      collection.remove(query, (error: Error) => {
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

      collection.find(query, fields || {}, options).toArray((error: Error, result: TDocument[]) => {
        finalizer();
        callback(error, result);
      });
    });
  }

  findOne<TDocument>(collectionName: string, query: Object, fields: Object, callback: (error: Error, result?: TDocument) => void) {
    this.collection(collectionName, (error, collection, finalizer) => {
      if (error)
        return callback(error);

      collection.findOne(query, fields || {}, (error: Error, result: TDocument) => {
        finalizer();
        callback(error, result);
      });
    });
  }

  count(collectionName: string, query: Object, callback: (error: Error, count?: number) => void) {
    this.collection(collectionName, (error, collection, finalizer) => {
      if (error)
        return callback(error);

      collection.count(query, (error: Error, count: number) => {
        finalizer();
        callback(error, count);
      });
    });
  }

  drop(collectionName: string, callback: (error: Error) => void): void {
    this.collection(collectionName, (error, collection, finalizer) => {
      if (error)
        return callback(error);

      collection.drop((error: Error) => {
        finalizer();

        if (callback)
          callback(error);
      });
    });
  }

  counter(name: string, callback: ICounterCallback) {
    var query = { name: name };
    var update = { $inc: { value: 1 } };

    this.findAndModify<ICounterDocument>('counters', query, update, {new: true}, (error, result) => {
      if (error)
        return callback(error);

      callback(null, result.value);
    });
  }

  static ObjectId(id: string): Object {
    return mongodb.ObjectId(id);
  }
}
