import { IEntity } from './ientity';
import { IFilter } from './ifilter';
import { IChange } from './ichange';

export interface IRepository<TEntity extends IEntity, TFilter extends IFilter, TChange extends IChange> {
  getAll(filter: TFilter): Promise<TEntity[]>;
  get(filter: TFilter): Promise<TEntity>;
  insert(entity: TEntity): Promise<TEntity>;
  update(id: string, change: TChange): Promise<TEntity>;
  delete(id: string): Promise<void>;
}
