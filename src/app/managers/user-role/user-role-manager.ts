import { IUserRole, IUserRoleFilter, IUserRoleChange, IUserRoleManager, IUserRoleRepository } from '../../framework/user-role';
import ManagerBase from '../manager-base';

const NameRegEx = /.+/;

export class UserRoleManager extends ManagerBase<IUserRole, IUserRoleFilter, IUserRoleChange> implements IUserRoleManager {
  constructor(repository: IUserRoleRepository) {
    super(repository);
  }

  validateEntity(entity: IUserRole) {
    // TODO: entity.user
    // TODO: entity.project

    if (entity.name === undefined)
      return { message: 'Missing name.' };

    if (!NameRegEx.test(entity.name))
      return { message: 'Invalid name.' };

    return null;
  }

  validateChange(change: IUserRoleChange) {
    // TODO: entity.user
    // TODO: entity.project

    if (change.name !== undefined) {
      if (!NameRegEx.test(change.name))
        return { message: 'Invalid name.' };
    }

    return null;
  }
}
