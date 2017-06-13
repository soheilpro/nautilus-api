import { IQuery } from './iquery';
import { IUpdate } from './iupdate';

export interface IDB {
  select<TDocument>(collectionName: string, query: IQuery): Promise<TDocument[]>;
  selectOne<TDocument>(collectionName: string, query: IQuery): Promise<TDocument>;
  count(collectionName: string, query: IQuery): Promise<number>;
  insert<TDocument>(collectionName: string, document: TDocument): Promise<void>;
  update<TDocument>(collectionName: string, query: IQuery, update: IUpdate): Promise<TDocument>;
  delete(collectionName: string, query: IQuery): Promise<void>;
  dropCollection(collectionName: string): Promise<void>;
}
