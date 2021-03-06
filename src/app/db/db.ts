import { IDateTimeService } from '../services';
import { ObjectHelper } from '../utilities/object-helper';
import { IDB } from './idb';
import { IConnection } from './iconnection';
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
  constructor(private connection: IConnection, private dateTimeService: IDateTimeService) {
  }

  async select<TDocument extends IDocument>(collectionName: string, query: IQuery) {
    const db = await this.connection.getDB();
    const collection = db.collection<TDocument>(collectionName);

    return await collection.find<TDocument>(ObjectHelper.cleanUp(query)).toArray();
  }

  async count(collectionName: string, query: IQuery) {
    const db = await this.connection.getDB();
    const collection = db.collection(collectionName);

    return await collection.count(ObjectHelper.cleanUp(query));
  }

  async insert<TDocument extends IDocument>(collectionName: string, document: IDocument) {
    const db = await this.connection.getDB();
    const collection = db.collection<TDocument>(collectionName);

    return (await collection.insertOne(ObjectHelper.cleanUp(document))).ops[0];
  }

  async update<TDocument extends IDocument>(collectionName: string, query: IQuery, update: IUpdate, upsert?: boolean) {
    const db = await this.connection.getDB();
    const collection = db.collection<TDocument>(collectionName);

    return (await collection.findOneAndUpdate(ObjectHelper.cleanUp(query), ObjectHelper.cleanUp(update), { returnOriginal: false, upsert: upsert })).value;
  }

  async delete(collectionName: string, query: IQuery) {
    const db = await this.connection.getDB();
    const collection = db.collection(collectionName);

    await collection.deleteMany(ObjectHelper.cleanUp(query));
  }

  async drop(collectionName: string) {
    const db = await this.connection.getDB();
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
    return await this.counter('*.meta.version');
  }
}
