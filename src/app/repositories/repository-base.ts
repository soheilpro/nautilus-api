import * as _ from 'underscore';
import { IEntity, IFilter, IChange, IRepository } from '../framework';
import { IDB, IDocument, IQuery, ObjectId } from '../db';

export default abstract class RepositoryBase<TEntity extends IEntity, TFilter extends IFilter, TChange extends IChange, TDocument extends IDocument> implements IRepository<TEntity, TFilter, TChange> {
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
  abstract filterToQuery(filter: TFilter): IQuery;
  abstract changeToUpdate(change: TChange): object;
  abstract documentToEntity(document: TDocument): TEntity;
  abstract entityToDocument(entity: TEntity): TDocument;

  async getAll(filter: TFilter) {
    const query = this.filterToQuery(filter);
    query['meta.state'] = { $lte: 1 };

    const documents = await this.db.select<TDocument>(this.collectionName(), this.cleanUp(query));

    return documents.map(this.documentToEntity);
  }

  async get(filter: TFilter) {
    const query = this.filterToQuery(filter);
    query['meta.state'] = { $lte: 1 };

    const document = await this.db.selectOne<TDocument>(this.collectionName(), this.cleanUp(query));

    return this.documentToEntity(document);
  }

  async insert(entity: TEntity) {
    const document = this.entityToDocument(entity);

    await this.db.insert<TDocument>(this.collectionName(), this.cleanUp(document));

    return this.documentToEntity(document);
  }

  async update(id: string, change: TChange) {
    const filter = { id: id } as TFilter;
    const query = this.filterToQuery(filter);
    const update = this.changeToUpdate(change);

    const document = await this.db.update<TDocument>(this.collectionName(), this.cleanUp(query), this.cleanUp(update));

    return this.documentToEntity(document);
  }

  async delete(id: string) {
    const filter = { id: id } as TFilter;
    const query = this.filterToQuery(filter);

    await this.db.delete(this.collectionName(), this.cleanUp(query));

    this.cleanUp(null);
  }

  private cleanUp<T extends object>(object: T): T {
    const result = _.clone(object) as IObject;

    _.each(result, (value: any, key: string) => {
      if (value === undefined || (_.isObject(value) && _.isEmpty(value) && !_.isDate(value)))
        delete result[key];
    });

    return result as T;
  }

  protected toRef(entity: IEntity): IDocument {
    if (!entity)
      return undefined;

    return {
      _id: new ObjectId(entity.id),
    };
  }

  protected toRefArray(entities: IEntity[]): IDocument[] {
    if (!entities)
      return undefined;

    const result = entities.map<IDocument>(this.toRef);

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

    const result = documents.map(this.fromRef);

    if (result.length === 0)
      return undefined;

    return result;
  }

  protected toObjectId(object: IEntity): ObjectId {
    if (!object)
      return undefined;

    if (!object.id)
      return undefined;

    return new ObjectId(object.id);
  }
}
