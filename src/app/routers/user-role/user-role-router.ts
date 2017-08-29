import { RouterBase } from '../router-base';
import { IUserRole, IUserRoleManager, IUserRoleFilter, IUserRoleChange } from '../../framework/user-role';
import { IProjectManager } from '../../framework/project';
import { IUserManager } from '../../framework/user';
import { IUserLogManager } from '../../framework/user-log';
import { IDateTimeService } from '../../services';
import { UserRoleModel } from '../../models/user-role';
import { IRequest, IParams } from '../../web';

export class UserRoleRouter extends RouterBase<IUserRole, IUserRoleFilter, IUserRoleChange> {
  constructor(userRoleManager: IUserRoleManager, private userManager: IUserManager, private projectManager: IProjectManager, userLogManager: IUserLogManager, dateTimeService: IDateTimeService) {
    super(userRoleManager, userLogManager, dateTimeService);
  }

  readonly name = 'user-roles';

  getRoutes() {
    return [
      this.protectedRoute('get',   '/userroles',     this.getEntities,  ['user-roles.read']),
      this.protectedRoute('get',   '/userroles/:id', this.getEntity,    ['user-roles.read']),
      this.protectedRoute('post',  '/userroles',     this.postEntity,   ['user-roles.write']),
      this.protectedRoute('patch', '/userroles/:id', this.patchEntity,  ['user-roles.write']),
      this.protectedRoute('del',   '/userroles/:id', this.deleteEntity, ['user-roles.write']),
    ];
  }

  async entityFromParams(params: IParams, request: IRequest) {
    return {
      ...await super.entityFromParams(params, request),
      user: await params.readEntity('user_id', this.userManager),
      project: await params.readEntity('project_id', this.projectManager),
      name: params.readString('name'),
    };
  }

  async changeFromParams(params: IParams, request: IRequest) {
    return {
      ...await super.changeFromParams(params, request),
      user: await params.readEntity('user_id', this.userManager),
      project: await params.readEntity('project_id', this.projectManager),
      name: params.readString('name'),
    };
  }

  entityToModel(entity: IUserRole) {
    if (!entity)
      return undefined;

    return new UserRoleModel(entity);
  }
}
