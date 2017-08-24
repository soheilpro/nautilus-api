import { IManager } from '../imanager';
import { IItemRelationship } from './iitem-relationship';
import { IItemRelationshipFilter } from './iitem-relationship-filter';
import { IItemRelationshipChange } from './iitem-relationship-change';

export interface IItemRelationshipManager extends IManager<IItemRelationship, IItemRelationshipFilter, IItemRelationshipChange> {
}
