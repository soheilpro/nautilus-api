import * as mongodb from 'mongodb';

export class DB {
  private static _db: mongodb.Db;

  private async opendb(): Promise<mongodb.Db> {
    if (!DB._db) {
      const address = 'mongodb://localhost:27017/nautilus'; // config.get('NAUTILUS_API_DB_ADDRESS');
      DB._db = await mongodb.MongoClient.connect(address);
    }

    return Promise.resolve(DB._db);
  }

  async select<TDocument>(collectionName: string, query: Object, fields: Object): Promise<TDocument[]> {
    const db = await this.opendb();
    const collection = db.collection(collectionName);

    const result = await collection.find<TDocument>(query, fields || {}).toArray();

    return Promise.resolve(result);
  }

  async selectOne<TDocument>(collectionName: string, query: Object, fields: Object): Promise<TDocument> {
    const db = await this.opendb();
    const collection = db.collection(collectionName);

    const result = await collection.findOne<TDocument>(query, fields || {});

    return Promise.resolve(result);
  }

  async count(collectionName: string, query: Object): Promise<number> {
    const db = await this.opendb();
    const collection = db.collection(collectionName);

    const result = await collection.count(query);

    return Promise.resolve(result);
  }

  async insert<TDocument>(collectionName: string, document: TDocument): Promise<void> {
    const db = await this.opendb();
    const collection = db.collection(collectionName);

    await collection.insertOne(document);
  }

  async update(collectionName: string, query: Object, update: Object): Promise<void> {
    const db = await this.opendb();
    const collection = db.collection(collectionName);

    await collection.updateOne(query, update);
  }

  async modify<TDocument>(collectionName: string, query: Object, update: Object): Promise<TDocument> {
    const db = await this.opendb();
    const collection = db.collection(collectionName);

    const result = await collection.findOneAndUpdate(query, update);

    return Promise.resolve(result.value);
  }

  async delete(collectionName: string, query: Object): Promise<void> {
    const db = await this.opendb();
    const collection = db.collection(collectionName);

    await collection.deleteMany(query);
  }

  async dropCollection(collectionName: string): Promise<void> {
    const db = await this.opendb();
    const collection = db.collection(collectionName);

    return collection.drop();
  }
}
