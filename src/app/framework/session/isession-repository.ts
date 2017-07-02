import { IRepository } from '../irepository';
import { ISession } from './isession';
import { ISessionFilter } from './isession-filter';
import { ISessionChange } from './isession-change';

export interface ISessionRepository extends IRepository<ISession, ISessionFilter, ISessionChange> {
}
