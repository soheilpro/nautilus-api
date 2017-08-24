import * as restify from 'restify';
import { RouterBase } from '../router-base';
import { IUser, IUserManager, IUserFilter, IUserChange } from '../../framework/user';
import { IUserLogManager } from '../../framework/user-log';
import { IDateTimeService } from '../../framework/system';
import { IRequest } from '../../irequest';
import { IResponse } from '../../iresponse';
import { IParams } from '../iparams';
import { Params } from '../params';
import { IUserModel } from './iuser-model';

export class UserRouter extends RouterBase<IUser, IUserFilter, IUserChange, IUserModel> {
  constructor(private userManager: IUserManager, userLogManager: IUserLogManager, dateTimeService: IDateTimeService) {
    super(userManager, userLogManager, dateTimeService);

    this.getPermissions = this.getPermissions.bind(this);
  }

  getName() {
    return 'users';
  }

  getRoutes() {
    return [
      this.protectedRoute('get',   '/users',                 this.getEntities,    ['users.read']),
      this.protectedRoute('get',   '/users/:id',             this.getEntity,      ['users.read']),
      this.protectedRoute('post',  '/users',                 this.postEntity,     ['users.write']),
      this.protectedRoute('patch', '/users/:id',             this.patchEntity,    ['users.write']),
      this.protectedRoute('del',   '/users/:id',             this.deleteEntity,   ['users.write']),
      this.protectedRoute('get',   '/users/:id/permissions', this.getPermissions, ['users.read']),
    ];
  }

  async getPermissions(request: IRequest, response: IResponse) {
    const params = new Params(request);
    const user = await params.readEntity('id', this.userManager);

    if (!user)
      return response.send(new restify.NotFoundError());

    if (user.id !== request.user.id)
      return response.send(new restify.ForbiddenError());

    const data = request.permissions;

    response.send({
      data: data,
    });
  }

  async entityFromParams(params: IParams, request: IRequest) {
    return {
      ...await super.entityFromParams(params, request),
      username: params.readString('username'),
      password: params.readString('password'),
      name: params.readString('name'),
      email: params.readString('email'),
    };
  }

  async changeFromParams(params: IParams, request: IRequest) {
    return {
      ...await super.changeFromParams(params, request),
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
