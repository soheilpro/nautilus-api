import { IManager } from '../imanager';
import { IItemType } from './iitem-type';
import { IItemTypeFilter } from './iitem-type-filter';
import { IItemTypeChange } from './iitem-type-change';

export interface IItemTypeManager extends IManager<IItemType, IItemTypeFilter, IItemTypeChange> {
}
