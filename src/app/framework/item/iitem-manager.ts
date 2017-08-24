import { IManager } from '../imanager';
import { IItem } from './iitem';
import { IItemFilter } from './iitem-filter';
import { IItemChange } from './iitem-change';

export interface IItemManager extends IManager<IItem, IItemFilter, IItemChange> {
}
