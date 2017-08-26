import * as _ from 'underscore';
import { IEntity, IFilter, IChange, IManager, IValidationError, IRepository, DuplicateEntityError } from '../framework';
import { ObjectHelper } from '../utilities';

export default abstract class ManagerBase<TEntity extends IEntity, TFilter extends IFilter, TChange extends IChange> implements IManager<TEntity, TFilter, TChange> {
  constructor(protected repository: IRepository<TEntity, TFilter, TChange>) {
  }

  getAll(filter: TFilter) {
    return this.repository.getAll(filter);
  }

  get(filter: TFilter) {
    return this.repository.get(filter);
  }

  async insert(entity: TEntity) {
    const duplicateCheckFilter = ObjectHelper.cleanUp(this.getEntityDuplicateCheckFilter(entity));

    if (duplicateCheckFilter && !_.isEmpty(duplicateCheckFilter)) {
      const existingEntities = await this.repository.getAll(duplicateCheckFilter);

      if (existingEntities.length !== 0)
        throw new DuplicateEntityError();
    }

    return this.repository.insert(entity);
  }

  async update(id: string, change: TChange) {
    const duplicateCheckFilter = ObjectHelper.cleanUpObject(this.getChangeDuplicateCheckFilter(change));

    if (duplicateCheckFilter && !_.isEmpty(duplicateCheckFilter)) {
      const existingEntities = await this.repository.getAll(duplicateCheckFilter);

      if (existingEntities.length > 1)
        throw new DuplicateEntityError();

      if (existingEntities.length === 1 && existingEntities[0].id !== id)
        throw new DuplicateEntityError();
    }

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

  getEntityDuplicateCheckFilter(entity: TEntity) {
    return null as TFilter;
  }

  getChangeDuplicateCheckFilter(change: TChange) {
    return null as TFilter;
  }
}
