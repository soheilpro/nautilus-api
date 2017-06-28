import { RouterBase } from '../router-base';
import { IUserRole, IUserRoleManager, IUserRoleFilter, IUserRoleChange } from '../../framework/user-role';
import { IRequest } from '../../irequest';
import { IUserRoleModel } from './iuser-role-model';

export class UserRoleRouter extends RouterBase<IUserRole, IUserRoleFilter, IUserRoleChange, IUserRoleModel> {
  constructor(userRoleManager: IUserRoleManager) {
    super(userRoleManager);
  }

  getRoutes() {
    return [
      this.route('get',   '/userroles',     this.getEntities,  ['user-roles.read']),
      this.route('get',   '/userroles/:id', this.getEntity,    ['user-roles.read']),
      this.route('post',  '/userroles',     this.postEntity,   ['user-roles.write']),
      this.route('patch', '/userroles/:id', this.patchEntity,  ['user-roles.write']),
      this.route('del',   '/userroles/:id', this.deleteEntity, ['user-roles.write']),
    ];
  }

  entityFromRequest(request: IRequest) {
    return {
      ...super.entityFromRequest(request),
      user: this.readEntity(request.params['user_id']),
      project: this.readEntity(request.params['project_id']),
      name: request.params['name'],
    };
  }

  protected changeFromRequest(request: IRequest) {
    return {
      username: request.params['username'],
      user: this.readEntity(request.params['user_id']),
      project: this.readEntity(request.params['project_id']),
      name: request.params['name'],
    };
  }

  entityToModel(entity: IUserRole): IUserRoleModel {
    if (!entity)
      return undefined;

    return {
      ...super.entityToModel(entity),
      user: this.renderEntity(entity.user),
      project: this.renderEntity(entity.project),
      name: entity.name,
    };
  }
}
