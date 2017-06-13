import { IRepository } from '../irepository';
import { IUser } from './iuser';
import { IUserFilter } from './iuser-filter';
import { IUserChange } from './iuser-change';

export interface IUserRepository extends IRepository<IUser, IUserFilter, IUserChange> {
}
