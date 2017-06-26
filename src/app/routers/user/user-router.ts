import * as restify from 'restify';
import { RouterBase } from '../router-base';
import { IUser, IUserManager, IUserFilter, IUserChange } from '../../framework/user';
import { IUserModel } from './iuser-model';

export class UserRouter extends RouterBase<IUser, IUserFilter, IUserChange, IUserModel> {
  constructor(userManager: IUserManager) {
    super(userManager);
  }

  register(server: restify.Server) {
    server.get('/users', this.getEntities);
    server.get('/users/:id', this.getEntity);
    server.post('/users', this.postEntity);
    server.patch('/users/:id', this.patchEntity);
    server.del('/users/:id', this.deleteEntity);
  }

  entityFromRequest(request: restify.Request) {
    return {
      ...super.entityFromRequest(request),
      username: request.params['username'],
      name: request.params['name'],
      email: request.params['email'],
    };
  }

  protected changeFromRequest(request: restify.Request) {
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
