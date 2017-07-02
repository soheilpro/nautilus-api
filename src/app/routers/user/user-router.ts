import { RouterBase } from '../router-base';
import { IUser, IUserManager, IUserFilter, IUserChange } from '../../framework/user';
import { IParams } from '../iparams';
import { IUserModel } from './iuser-model';

export class UserRouter extends RouterBase<IUser, IUserFilter, IUserChange, IUserModel> {
  constructor(userManager: IUserManager) {
    super(userManager);
  }

  getRoutes() {
    return [
      this.protectedRoute('get',   '/users',     this.getEntities,  ['users.read']),
      this.protectedRoute('get',   '/users/:id', this.getEntity,    ['users.read']),
      this.protectedRoute('post',  '/users',     this.postEntity,   ['users.write']),
      this.protectedRoute('patch', '/users/:id', this.patchEntity,  ['users.write']),
      this.protectedRoute('del',   '/users/:id', this.deleteEntity, ['users.write']),
    ];
  }

  async entityFromParams(params: IParams) {
    return {
      ...await super.entityFromParams(params),
      username: params.readString('username'),
      password: params.readString('password'),
      name: params.readString('name'),
      email: params.readString('email'),
    };
  }

  async changeFromParams(params: IParams) {
    return {
      ...await super.changeFromParams(params),
      username: params.readString('username'),
      password: params.readString('password'),
      name: params.readString('name'),
      email: params.readString('email'),
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
