import { IRepository } from '../irepository';
import { IItemType } from './iitem-type';
import { IItemTypeFilter } from './iitem-type-filter';
import { IItemTypeChange } from './iitem-type-change';

export interface IItemTypeRepository extends IRepository<IItemType, IItemTypeFilter, IItemTypeChange> {
}
