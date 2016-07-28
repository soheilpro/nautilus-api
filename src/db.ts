/// <reference path="./typings/index.d.ts" />

import config from './config';

var mongodb = require('mongodb');
var _ = require('underscore');

export class DB {
  private static _db

  opendb(callback) {
    if (DB._db)
      return callback(null, DB._db);

    mongodb.MongoClient.connect(config.get('db'), (error, db) => {
      if (error)
        return callback(error);

      DB._db = db;

      callback(null, db);
    });
  }

  collection(collectionName, callback) {
    this.opendb((error, db) => {
      if (error)
        return callback(error);

      db.collection(collectionName, (error, collection) => {
        if (error)
          return callback(error);

        callback(null, collection, () => {});
      });
    });
  }

  insert(collectionName, document, callback) {
    this.collection(collectionName, (error, collection, finalizer) => {
      if (error)
        return callback(error);

      collection.insert(document, (error) => {
        finalizer();

        if (callback)
          callback(error);
      });
    });
  }

  update(collectionName, query, document, options, callback) {
    this.collection(collectionName, (error, collection, finalizer) => {
      if (error)
        return callback(error);

      collection.update(query, document, options, (error, result) => {
        finalizer();

        if (callback)
          callback(error, result);
      });
    });
  }

  findAndModify(collectionName, query, document, options, callback) {
    this.collection(collectionName, (error, collection, finalizer) => {
      if (error)
        return callback(error);

      collection.findAndModify(query, [], document, options, (error, result) => {
        finalizer();
        callback(error, result);
      });
    });
  }

  remove(collectionName, query, callback) {
    this.collection(collectionName, (error, collection, finalizer) => {
      if (error)
        return callback(error);

      collection.remove(query, (error) => {
        finalizer();

        if (callback)
          callback(error);
      });
    });
  }

  find(collectionName, query, fields, options, callback) {
    this.collection(collectionName, (error, collection, finalizer) => {
      if (error)
        return callback(error);

      collection.find(query, fields || {}, options).toArray((error, result) => {
        finalizer();
        callback(error, result);
      });
    });
  }

  findOne(collectionName, query, fields, callback) {
    this.collection(collectionName, (error, collection, finalizer) => {
      if (error)
        return callback(error);

      collection.findOne(query, fields || {}, (error, result) => {
        finalizer();
        callback(error, result);
      });
    });
  }

  count(collectionName, query, callback) {
    this.collection(collectionName, (error, collection, finalizer) => {
      if (error)
        return callback(error);

      collection.count(query, (error, count) => {
        finalizer();
        callback(error, count);
      });
    });
  }

  group(collectionName, keys, condition, initial, reduce, callback) {
    this.collection(collectionName, (error, collection, finalizer) => {
      if (error)
        return callback(error);

      collection.group(keys, condition, initial, reduce, null, true, {}, (error, result) => {
        finalizer();
        callback(error, result);
      });
    });
  }

  static ObjectId(id) {
    return mongodb.ObjectId(id);
  }
}

export class Update {
  private $set = {};
  private $unset = { __noop__: '' };
  private $addToSet = {};
  private $pull = {};

  setOrUnset(key, value, map?) {
    if (value === undefined)
      return;

    if (value)
      this.$set[key] = map ? map(value) : value;
    else
      this.$unset[key] = '';
  };

  addToSet(key, value, map?) {
    if (value === undefined)
      return;

    this.$addToSet[key] = { $each: map ? map(value) : value };
  };

  removeFromSet(key, value, map?) {
    if (value === undefined)
      return;

    this.$pull[key] = { $in: map ? map(value) : value };
  };

  value() {
    var result = _.clone(this);

    _.each(result, (value, key) => {
      if (_.isEmpty(result[key]))
        delete result[key];
    });

    return result;
  };
}