import { IManager } from '../imanager';
import { IUserRole } from './iuser-role';
import { IUserRoleFilter } from './iuser-role-filter';
import { IUserRoleChange } from './iuser-role-change';

export interface IUserRoleManager extends IManager<IUserRole, IUserRoleFilter, IUserRoleChange> {
}
