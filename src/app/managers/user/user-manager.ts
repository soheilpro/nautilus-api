import * as bcrypt from 'bcryptjs';
import { IUser, IUserFilter, IUserChange, IUserManager, IUserRepository } from '../../framework/user';
import ManagerBase from '../manager-base';

export class UserManager extends ManagerBase<IUser, IUserFilter, IUserChange> implements IUserManager {
  constructor(repository: IUserRepository) {
    super(repository);
  }

  hashPassword(password: string) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }

  testPassword(password: string, passwordHash: string) {
    return bcrypt.compareSync(password, passwordHash);
  }
}
