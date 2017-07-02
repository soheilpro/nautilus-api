import { IManager } from '../imanager';
import { ISession } from './isession';
import { ISessionFilter } from './isession-filter';
import { ISessionChange } from './isession-change';

export interface ISessionManager extends IManager<ISession, ISessionFilter, ISessionChange> {
}
