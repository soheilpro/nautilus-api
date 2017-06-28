import { IUserRole, IUserRoleFilter, IUserRoleChange, IUserRoleManager, IUserRoleRepository } from '../../framework/user-role';
import ManagerBase from '../manager-base';

export class UserRoleManager extends ManagerBase<IUserRole, IUserRoleFilter, IUserRoleChange> implements IUserRoleManager {
  constructor(repository: IUserRoleRepository) {
    super(repository);
  }
}
