import { IRepository } from '../irepository';
import { IItemRelationship } from './iitem-relationship';
import { IItemRelationshipFilter } from './iitem-relationship-filter';
import { IItemRelationshipChange } from './iitem-relationship-change';

export interface IItemRelationshipRepository extends IRepository<IItemRelationship, IItemRelationshipFilter, IItemRelationshipChange> {
}
