import { IRepository } from '../irepository';
import { IItemState } from './iitem-state';
import { IItemStateFilter } from './iitem-state-filter';
import { IItemStateChange } from './iitem-state-change';

export interface IItemStateRepository extends IRepository<IItemState, IItemStateFilter, IItemStateChange> {
}
