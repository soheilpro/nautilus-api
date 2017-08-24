import { IRepository } from '../irepository';
import { IUserLog } from './iuser-log';
import { IUserLogFilter } from './iuser-log-filter';
import { IUserLogChange } from './iuser-log-change';

export interface IUserLogRepository extends IRepository<IUserLog, IUserLogFilter, IUserLogChange> {
}
