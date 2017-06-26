import { IDocument } from './idocument';
import { IManagedDocument } from './imanaged-document';
import { IQuery } from './iquery';
import { IUpdate } from './iupdate';

export interface IDB {
  select<TDocument extends IDocument>(collectionName: string, query: IQuery): Promise<TDocument[]>;
  count(collectionName: string, query: IQuery): Promise<number>;
  insert<TDocument extends IDocument>(collectionName: string, document: IDocument): Promise<TDocument>;
  update<TDocument extends IDocument>(collectionName: string, query: IQuery, update: IUpdate): Promise<TDocument>;
  delete(collectionName: string, query: IQuery): Promise<void>;
  drop(collectionName: string): Promise<void>;

  selectManaged<TDocument extends IManagedDocument>(collectionName: string, query: IQuery): Promise<TDocument[]>;
  countManaged(collectionName: string, query: IQuery): Promise<number>;
  insertManaged<TDocument extends IManagedDocument>(collectionName: string, document: IDocument): Promise<TDocument>;
  updateManaged<TDocument extends IManagedDocument>(collectionName: string, query: IQuery, update: IUpdate): Promise<TDocument>;
  deleteManaged(collectionName: string, query: IQuery): Promise<void>;
}
