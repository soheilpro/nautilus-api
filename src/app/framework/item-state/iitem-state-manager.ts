import { IManager } from '../imanager';
import { IItemState } from './iitem-state';
import { IItemStateFilter } from './iitem-state-filter';
import { IItemStateChange } from './iitem-state-change';

export interface IItemStateManager extends IManager<IItemState, IItemStateFilter, IItemStateChange> {
}
