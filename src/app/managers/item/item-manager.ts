import { IItem, IItemFilter, IItemChange, IItemManager, IItemRepository } from '../../framework/item';
import ManagerBase from '../manager-base';

const KindRegEx = /.+/;

export class ItemManager extends ManagerBase<IItem, IItemFilter, IItemChange> implements IItemManager {
  constructor(repository: IItemRepository) {
    super(repository);
  }

  async insert(entity: IItem) {
    entity.sid = (await this.repository.counter('items.sid')).toString();

    return super.insert(entity);
  }

  validateEntity(entity: IItem) {
    if (entity.kind === undefined)
      return { message: 'Missing kind.' };

    if (!KindRegEx.test(entity.kind))
      return { message: 'Invalid kind.' };

    if (entity.createdBy === undefined)
      return { message: 'Missing createdBy.' };

    return null;
  }

  validateChange(change: IItemChange) {
    if (change.modifiedBy === undefined)
      return { message: 'Missing modifiedBy.' };

    return null;
  }
}
