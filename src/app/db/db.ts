import * as mongodb from 'mongodb';
import { IDateTimeService } from '../framework/system';
import { ObjectHelper } from '../utilities';
import { IDB } from './idb';
import { IDocument } from './idocument';
import { IManagedDocument } from './imanaged-document';
import { IQuery } from './iquery';
import { IUpdate } from './iupdate';
import { Update } from './update';
import { ManagedDocumentState } from './managed-document-state';

interface ICounterDocument extends IDocument {
  name: string;
  value: number;
}

export class DB implements IDB {
  private static _db: mongodb.Db;

  constructor(private address: string, private dateTimeService: IDateTimeService) {
  }

  private async getDB() {
    if (!DB._db)
      DB._db = await mongodb.MongoClient.connect(this.address);

    return DB._db;
  }

  async select<TDocument extends IDocument>(collectionName: string, query: IQuery) {
    const db = await this.getDB();
    const collection = db.collection<TDocument>(collectionName);

    return await collection.find<TDocument>(ObjectHelper.cleanUp(query)).toArray();
  }

  async count(collectionName: string, query: IQuery) {
    const db = await this.getDB();
    const collection = db.collection(collectionName);

    return await collection.count(ObjectHelper.cleanUp(query));
  }

  async insert<TDocument extends IDocument>(collectionName: string, document: IDocument) {
    const db = await this.getDB();
    const collection = db.collection<TDocument>(collectionName);

    return (await collection.insertOne(ObjectHelper.cleanUp(document))).ops[0];
  }

  async update<TDocument extends IDocument>(collectionName: string, query: IQuery, update: IUpdate) {
    const db = await this.getDB();
    const collection = db.collection<TDocument>(collectionName);

    return (await collection.findOneAndUpdate(ObjectHelper.cleanUp(query), ObjectHelper.cleanUp(update), { returnOriginal: false })).value;
  }

  async delete(collectionName: string, query: IQuery) {
    const db = await this.getDB();
    const collection = db.collection(collectionName);

    await collection.deleteMany(ObjectHelper.cleanUp(query));
  }

  async drop(collectionName: string) {
    const db = await this.getDB();
    const collection = db.collection(collectionName);

    return collection.drop();
  }

  async counter(name: string) {
    const query = { name };
    const update = { $inc: { value: 1 } };

    const result = await this.update<ICounterDocument>('counters', query, update);

    return result.value;
  }

  async selectManaged<TDocument extends IManagedDocument>(collectionName: string, query: IQuery) {
    query = {
      ...query,
      'meta.state': { $ne: ManagedDocumentState.Deleted },
    };

    return (await this.select(collectionName, query)) as TDocument[];
  }

  async countManaged(collectionName: string, query: IQuery) {
    query = {
      ...query,
      'meta.state': { $ne: ManagedDocumentState.Deleted },
    };

    return await this.count(collectionName, query);
  }

  async insertManaged<TDocument extends IManagedDocument>(collectionName: string, document: IDocument) {
    const metaDocument = {
      ...document,
      meta: {
        version: await this.nextVersion(),
        state: ManagedDocumentState.Inserted,
        insertDateTime: this.dateTimeService.nowUTC(),
      },
    };

    return (await this.insert(collectionName, metaDocument)) as TDocument;
  }

  async updateManaged<TDocument extends IManagedDocument>(collectionName: string, query: IQuery, update: IUpdate) {
    query = {
      ...query,
      'meta.state': { $ne: ManagedDocumentState.Deleted },
    };

    update = new Update(update);
    update.setOrUnset('meta.version', await this.nextVersion());
    update.setOrUnset('meta.state', ManagedDocumentState.Updated);
    update.setOrUnset('meta.updateDateTime', this.dateTimeService.nowUTC());

    return (await this.update(collectionName, query, update)) as TDocument;
  }

  async deleteManaged(collectionName: string, query: IQuery) {
    query = {
      ...query,
      'meta.state': { $ne: ManagedDocumentState.Deleted },
    };

    const update = new Update();
    update.setOrUnset('meta.version', await this.nextVersion());
    update.setOrUnset('meta.state', ManagedDocumentState.Deleted);
    update.setOrUnset('meta.deleteDateTime', this.dateTimeService.nowUTC());

    await this.update(collectionName, query, update);
  }

  private async nextVersion() {
    return await this.counter('_version');
  }
}
