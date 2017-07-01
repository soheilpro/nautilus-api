import { IUserRole, IUserRoleFilter, IUserRoleChange, IUserRoleManager, IUserRoleRepository } from '../../framework/user-role';
import ManagerBase from '../manager-base';

const NameRegEx = /.+/;

export class UserRoleManager extends ManagerBase<IUserRole, IUserRoleFilter, IUserRoleChange> implements IUserRoleManager {
  constructor(repository: IUserRoleRepository) {
    super(repository);
  }

  validateEntity(entity: IUserRole) {
    if (entity.user === undefined)
      return { message: 'Missing user.' };

    if (entity.user === null)
      return { message: 'Invalid user.' };

    if (entity.project === undefined)
      return { message: 'Missing project.' };

    if (entity.project === null)
      return { message: 'Invalid project.' };

    if (entity.name === undefined)
      return { message: 'Missing name.' };

    if (!NameRegEx.test(entity.name))
      return { message: 'Invalid name.' };

    return null;
  }

  validateChange(change: IUserRoleChange) {
    if (change.user !== undefined) {
      if (change.user === null)
        return { message: 'Invalid user.' };
    }

    if (change.project !== undefined) {
      if (change.project === null)
        return { message: 'Invalid project.' };
    }

    if (change.name !== undefined) {
      if (!NameRegEx.test(change.name))
        return { message: 'Invalid name.' };
    }

    return null;
  }
}
