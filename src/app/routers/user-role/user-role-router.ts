import { RouterBase } from '../router-base';
import { IUserRole, IUserRoleManager, IUserRoleFilter, IUserRoleChange } from '../../framework/user-role';
import { IUserManager } from '../../framework/user';
import { IProjectManager } from '../../framework/project';
import { IParams } from '../iparams';
import { IUserRoleModel } from './iuser-role-model';

export class UserRoleRouter extends RouterBase<IUserRole, IUserRoleFilter, IUserRoleChange, IUserRoleModel> {
  constructor(userRoleManager: IUserRoleManager, private userManager: IUserManager, private projectManager: IProjectManager) {
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

  async entityFromParams(params: IParams) {
    return {
      ...await super.entityFromParams(params),
      user: await params.readEntity('user_id', this.userManager),
      project: await params.readEntity('project_id', this.projectManager),
      name: params.readString('name'),
    };
  }

  async changeFromParams(params: IParams) {
    return {
      ...await super.changeFromParams(params),
      user: await params.readEntity('user_id', this.userManager),
      project: await params.readEntity('project_id', this.projectManager),
      name: params.readString('name'),
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
