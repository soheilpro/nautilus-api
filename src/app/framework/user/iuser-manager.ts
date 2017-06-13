import { IManager } from '../imanager';
import { IUser } from './iuser';
import { IUserFilter } from './iuser-filter';
import { IUserChange } from './iuser-change';

export interface IUserManager extends IManager<IUser, IUserFilter, IUserChange> {
}
