import { RouterBase } from '../router-base';
import { IItem, IItemManager, IItemFilter, IItemChange } from '../../framework/item';
import { IUser, IUserManager } from '../../framework/user';
import { IProjectManager } from '../../framework/project';
import { IItemTypeManager } from '../../framework/item-type';
import { IItemStateManager } from '../../framework/item-state';
import { IItemPriorityManager } from '../../framework/item-priority';
import { IPermission } from '../../framework/security';
import { IRequest } from '../../irequest';
import { PermissionHelper } from '../../security';
import { IParams } from '../iparams';
import { IItemModel } from './iitem-model';

export class ItemRouter extends RouterBase<IItem, IItemFilter, IItemChange, IItemModel> {
  constructor(itemManager: IItemManager, private userManager: IUserManager, private projectManager: IProjectManager, private itemTypeManager: IItemTypeManager, private itemStateManager: IItemStateManager, private itemPriorityManager: IItemPriorityManager) {
    super(itemManager);
  }

  getRoutes() {
    return [
      this.protectedRoute('get',   '/items',     this.getEntities),
      this.protectedRoute('get',   '/items/:id', this.getEntity),
      this.protectedRoute('post',  '/items',     this.postEntity),
      this.protectedRoute('patch', '/items/:id', this.patchEntity),
      this.protectedRoute('del',   '/items/:id', this.deleteEntity),
    ];
  }

  checkEntityAccess(entity: IItem, access: string, user: IUser, permissions: IPermission[]) {
    if (entity.project)
      return PermissionHelper.hasPermission(permissions, `project.${access}`, { projectId: entity.project.id });

    return entity.createdBy.id === user.id;
  }

  checkChangeAccess(change: IItem, user: IUser, permissions: IPermission[]) {
    if (change.project)
      return PermissionHelper.hasPermission(permissions, 'project.write', { projectId: change.project.id });

    return true;
  }

  async entityFromParams(params: IParams, request: IRequest) {
    return {
      ...await super.entityFromParams(params, request),
      kind: params.readString('kind'),
      type: await params.readEntity('type_id', this.itemTypeManager),
      title: params.readString('title'),
      description: params.readString('description'),
      state: await params.readEntity('state_id', this.itemStateManager),
      priority: await params.readEntity('priority_id', this.itemPriorityManager),
      tags: params.readStringArray('tags'),
      project: await params.readEntity('project_id', this.projectManager),
      assignedTo: await params.readEntity('assignedTo_id', this.userManager),
      createdBy: request.user,
    };
  }

  async changeFromParams(params: IParams, request: IRequest) {
    return {
      ...await super.changeFromParams(params, request),
      type: await params.readEntity('type_id', this.itemTypeManager),
      title: params.readString('title'),
      description: params.readString('description'),
      state: await params.readEntity('state_id', this.itemStateManager),
      priority: await params.readEntity('priority_id', this.itemPriorityManager),
      tags: params.readStringArray('tags'),
      project: await params.readEntity('project_id', this.projectManager),
      assignedTo: await params.readEntity('assignedTo_id', this.userManager),
      modifiedBy: request.user,
    };
  }

  entityToModel(entity: IItem): IItemModel {
    if (!entity)
      return undefined;

    return {
      ...super.entityToModel(entity),
      sid: entity.sid,
      kind: entity.kind,
      type: this.renderEntity(entity.type),
      title: entity.title,
      description: entity.description,
      state: this.renderEntity(entity.state),
      priority: this.renderEntity(entity.priority),
      tags: entity.tags,
      project: this.renderEntity(entity.project),
      assignedTo: this.renderEntity(entity.assignedTo),
      createdBy: this.renderEntity(entity.createdBy),
      modifiedBy: this.renderEntity(entity.modifiedBy),
    };
  }
}
