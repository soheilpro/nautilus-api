import { IManager } from '../imanager';
import { IItemPriority } from './iitem-priority';
import { IItemPriorityFilter } from './iitem-priority-filter';
import { IItemPriorityChange } from './iitem-priority-change';

export interface IItemPriorityManager extends IManager<IItemPriority, IItemPriorityFilter, IItemPriorityChange> {
}
