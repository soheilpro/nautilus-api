import { IUser, IUserFilter, IUserChange, IUserManager, IUserRepository } from '../../framework/user';
import ManagerBase from '../manager-base';

export default class UserManager extends ManagerBase<IUser, IUserFilter, IUserChange> implements IUserManager {
  constructor(repository: IUserRepository) {
    super(repository);
  }
}