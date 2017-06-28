import { IEntity, IFilter, IChange, IManager, IValidationError, IRepository } from '../framework';

export default abstract class ManagerBase<TEntity extends IEntity, TFilter extends IFilter, TChange extends IChange> implements IManager<TEntity, TFilter, TChange> {
  constructor(private repository: IRepository<TEntity, TFilter, TChange>) {
  }

  getAll(filter: TFilter) {
    return this.repository.getAll(filter);
  }

  get(filter: TFilter) {
    return this.repository.get(filter);
  }

  insert(entity: TEntity) {
    return this.repository.insert(entity);
  }

  update(id: string, change: TChange) {
    return this.repository.update(id, change);
  }

  delete(id: string) {
    return this.repository.delete(id);
  }

  validateEntity(entity: TEntity) {
    return null as IValidationError;
  }

  validateChange(change: TChange) {
    return null as IValidationError;
  }
}
