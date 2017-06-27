import { RouterBase } from '../router-base';
import { IUser, IUserManager, IUserFilter, IUserChange } from '../../framework/user';
import { IRequest } from '../../irequest';
import { IUserModel } from './iuser-model';

export class UserRouter extends RouterBase<IUser, IUserFilter, IUserChange, IUserModel> {
  constructor(userManager: IUserManager) {
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

  entityFromRequest(request: IRequest) {
    return {
      ...super.entityFromRequest(request),
      username: request.params['username'],
      name: request.params['name'],
      email: request.params['email'],
    };
  }

  protected changeFromRequest(request: IRequest) {
    return {
      username: request.params['username'],
      name: request.params['name'],
      email: request.params['email'],
    };
  }

  entityToModel(entity: IUser) {
    return {
      ...super.entityToModel(entity),
      username: entity.username,
      name: entity.name,
      email: entity.email,
    };
  }
}
