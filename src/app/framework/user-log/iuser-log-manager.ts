import { IManager } from '../imanager';
import { IUserLog } from './iuser-log';
import { IUserLogFilter } from './iuser-log-filter';
import { IUserLogChange } from './iuser-log-change';

export interface IUserLogManager extends IManager<IUserLog, IUserLogFilter, IUserLogChange> {
}
