import { IRepository } from '../irepository';
import { IUserRole } from './iuser-role';
import { IUserRoleFilter } from './iuser-role-filter';
import { IUserRoleChange } from './iuser-role-change';

export interface IUserRoleRepository extends IRepository<IUserRole, IUserRoleFilter, IUserRoleChange> {
}
