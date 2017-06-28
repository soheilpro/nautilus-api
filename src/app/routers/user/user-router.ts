import { RouterBase } from '../router-base';
import { IUser, IUserManager, IUserFilter, IUserChange } from '../../framework/user';
import { IParams } from '../iparams';
import { NonEmptyRegEx } from '../params';
import { IUserModel } from './iuser-model';

const UsernameRegEx = /[a-zA-Z][a-zA-Z0-9.]{1,}/;
const PasswordRegEx = /\w{8,}/;
const EMailRegEx = /\w+@\w+/;

export class UserRouter extends RouterBase<IUser, IUserFilter, IUserChange, IUserModel> {
  constructor(private userManager: IUserManager) {
    super(userManager);
  }

  getRoutes() {
    return [
      this.route('get',   '/users',     this.getEntities,  ['users.read']),
      this.route('get',   '/users/:id', this.getEntity,    ['users.read']),
      this.route('post',  '/users',     this.postEntity,   ['users.write']),
      this.route('patch', '/users/:id', this.patchEntity,  ['users.write']),
      this.route('del',   '/users/:id', this.deleteEntity, ['users.write']),
    ];
  }

  async entityFromParams(params: IParams) {
    return {
      ...await super.entityFromParams(params),
      username: params.readString('username', { required: true, pattern: UsernameRegEx }),
      passwordHash: this.userManager.hashPassword(params.readString('password', { required: true, pattern: PasswordRegEx })),
      name: params.readString('name', { required: true, pattern: NonEmptyRegEx }),
      email: params.readString('email', { required: true, pattern: EMailRegEx }),
    };
  }

  async changeFromParams(params: IParams) {
    const password = params.readString('password', { pattern: PasswordRegEx });

    return {
      ...await super.changeFromParams(params),
      username: params.readString('username', { pattern: UsernameRegEx }),
      passwordHash: password ? this.userManager.hashPassword(password) : undefined,
      name: params.readString('name', { pattern: NonEmptyRegEx }),
      email: params.readString('email', { pattern: EMailRegEx }),
    };
  }

  entityToModel(entity: IUser): IUserModel {
    if (!entity)
      return undefined;

    return {
      ...super.entityToModel(entity),
      username: entity.username,
      name: entity.name,
      email: entity.email,
    };
  }
}
