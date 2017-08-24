import { IRepository } from '../irepository';
import { IItem } from './iitem';
import { IItemFilter } from './iitem-filter';
import { IItemChange } from './iitem-change';

export interface IItemRepository extends IRepository<IItem, IItemFilter, IItemChange> {
}
