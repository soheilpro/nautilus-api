import * as _ from 'underscore';
import { IEntity, IFilter, IChange, IRepository } from '../framework';
import { IDB, IDocument, IManagedDocument, IUpdate, Update, ObjectId } from '../db';

export default abstract class RepositoryBase<TEntity extends IEntity, TFilter extends IFilter, TChange extends IChange, TDocument extends IManagedDocument> implements IRepository<TEntity, TFilter, TChange> {
  constructor(private db: IDB) {
    this.collectionName = this.collectionName.bind(this);
    this.filterToQuery = this.filterToQuery.bind(this);
    this.changeToUpdate = this.changeToUpdate.bind(this);
    this.documentToEntity = this.documentToEntity.bind(this);
    this.entityToDocument = this.entityToDocument.bind(this);
    this.toRef = this.toRef.bind(this);
    this.toRefArray = this.toRefArray.bind(this);
    this.fromRef = this.fromRef.bind(this);
    this.fromRefArray = this.fromRefArray.bind(this);
    this.toObjectId = this.toObjectId.bind(this);
  }

  abstract collectionName(): string;

  async getAll(filter: TFilter) {
    const query = this.filterToQuery(filter);

    const documents = await this.db.selectManaged<TDocument>(this.collectionName(), query);

    return documents.map(this.documentToEntity);
  }

  async get(filter: TFilter) {
    const query = this.filterToQuery(filter);

    const documents = await this.db.selectManaged<TDocument>(this.collectionName(), query);

    if (documents.length > 1)
      throw new Error('The filter returned more than one result.');

    if (documents.length === 0)
      return null;

    return this.documentToEntity(documents[0]);
  }

  async insert(entity: TEntity) {
    const document = this.entityToDocument(entity);

    const insertedDocument = await this.db.insertManaged<TDocument>(this.collectionName(), document);

    return this.documentToEntity(insertedDocument);
  }

  async update(id: string, change: TChange) {
    const filter = { id: id };
    const query = this.filterToQuery(filter);
    const update = this.changeToUpdate(change);

    const document = await this.db.updateManaged<TDocument>(this.collectionName(), query, update);

    return this.documentToEntity(document);
  }

  async delete(id: string) {
    const filter = { id: id };
    const query = this.filterToQuery(filter);

    await this.db.deleteManaged(this.collectionName(), query);
  }

  async counter(name: string) {
    return await this.db.counter(name);
  }

  private filterToQuery(filter: IFilter) {
    const result = {} as TFilter;

    for (let key in filter) {
      if (!filter.hasOwnProperty(key))
        continue;

      let value = filter[key];
      let keyParts = key.split('.');

      if (keyParts[keyParts.length - 1] === 'id') {
        // Change last .id to ._id
        keyParts.splice(keyParts.length - 1, 1, '_id');
        key = keyParts.join('.');

        if (value['$in'])
          value = { $in: value['$in'].map(this.toObjectId) };
        else
          value = this.toObjectId(value);

        result[key] = value;
      }
      else if (_.isArray(value)) {
        result[key] = value.map(this.filterToQuery);
      }
      else if (_.isObject(value)) {
        result[key] = this.filterToQuery(value);
      }
      else {
        result[key] = value;
      }
    }

    return result;
  }

  protected changeToUpdate(change: IChange) {
    return new Update() as IUpdate;
  }

  protected documentToEntity(document: TDocument) {
    return {
      id: document._id.toString(),
      meta: {
        version: document.meta.version,
        state: document.meta.state,
        insertDateTime: document.meta.insertDateTime,
        updateDateTime: document.meta.updateDateTime,
        deleteDateTime: document.meta.deleteDateTime,
      },
    } as TEntity;
  }

  protected entityToDocument(entity: TEntity) {
    return {
      _id: this.toObjectId(entity.id),
    } as TDocument;
  }

  protected toRef(entity: IEntity) {
    if (!entity)
      return undefined;

    return {
      _id: this.toObjectId(entity.id),
    };
  }

  protected toRefArray(entities: IEntity[]) {
    if (!entities)
      return undefined;

    const result = entities.map<IDocument>(this.toRef);

    if (result.length === 0)
      return undefined;

    return result;
  }

  protected fromRef(document: IDocument) {
    if (!document)
      return undefined;

    return {
      id: document._id.toString(),
    };
  }

  protected fromRefArray(documents: IDocument[]) {
    if (!documents)
      return undefined;

    const result = documents.map(this.fromRef);

    if (result.length === 0)
      return undefined;

    return result;
  }

  protected toObjectId(id: string) {
    if (!id)
      return undefined;

    if (!ObjectId.isValid(id))
      return new ObjectId(0);

    return new ObjectId(id);
  }
}
