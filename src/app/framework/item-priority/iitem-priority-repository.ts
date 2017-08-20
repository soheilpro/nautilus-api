import { IRepository } from '../irepository';
import { IItemPriority } from './iitem-priority';
import { IItemPriorityFilter } from './iitem-priority-filter';
import { IItemPriorityChange } from './iitem-priority-change';

export interface IItemPriorityRepository extends IRepository<IItemPriority, IItemPriorityFilter, IItemPriorityChange> {
}
