import * as mongodb from 'mongodb';
import { IDB } from './idb';
import { IDocument } from './idocument';
import { IQuery } from './iquery';
import { IUpdate } from './iupdate';

interface ICounterDocument extends IDocument {
  name: string;
  value: number;
}

export class DB implements IDB {
  private static _db: mongodb.Db;

  constructor(private address: string) {
  }

  async select<TDocument extends IDocument>(collectionName: string, query: IQuery) {
    const db = await this.getDB();
    const collection = db.collection(collectionName);

    const result = await collection.find<TDocument>(query).toArray();

    return result;
  }

  async selectOne<TDocument extends IDocument>(collectionName: string, query: IQuery) {
    const db = await this.getDB();
    const collection = db.collection(collectionName);

    const result = await collection.findOne<TDocument>(query);

    return result;
  }

  async count(collectionName: string, query: IQuery) {
    const db = await this.getDB();
    const collection = db.collection(collectionName);

    const result = await collection.count(query);

    return result;
  }

  async insert<TDocument extends IDocument>(collectionName: string, document: TDocument) {
    const db = await this.getDB();
    const collection = db.collection(collectionName);

    await collection.insertOne(document);
  }

  async update<TDocument extends IDocument>(collectionName: string, query: IQuery, update: IUpdate) {
    const db = await this.getDB();
    const collection = db.collection(collectionName);

    const result = await collection.findOneAndUpdate(query, update);

    return result.value as TDocument;
  }

  async delete(collectionName: string, query: IQuery) {
    const db = await this.getDB();
    const collection = db.collection(collectionName);

    await collection.deleteMany(query);
  }

  async dropCollection(collectionName: string) {
    const db = await this.getDB();
    const collection = db.collection(collectionName);

    return collection.drop();
  }

  private async getDB() {
    if (!DB._db)
      DB._db = await mongodb.MongoClient.connect(this.address);

    return DB._db;
  }

  protected async counter(name: string) {
    const query = { name };
    const update = { $inc: { value: 1 } };

    const result = await this.update<ICounterDocument>('counters', query, update);

    return result.value;
  }
}
