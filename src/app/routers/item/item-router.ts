import { RouterBase } from '../router-base';
import { IItem, IItemManager, IItemFilter, IItemChange } from '../../framework/item';
import { IProjectManager } from '../../framework/project';
import { IItemTypeManager } from '../../framework/item-type';
import { IItemStateManager } from '../../framework/item-state';
import { IItemRelationshipManager } from '../../framework/item-relationship';
import { IPermission } from '../../framework/security';
import { IUser, IUserManager } from '../../framework/user';
import { IUserLogManager } from '../../framework/user-log';
import { IDateTimeService } from '../../services';
import { ItemModel, ItemRelationshipModel } from '../../models';
import { PermissionHelper } from '../../security';
import { IRequest, IParams } from '../../web';

export class ItemRouter extends RouterBase<IItem, IItemFilter, IItemChange> {
  constructor(itemManager: IItemManager, private userManager: IUserManager, private projectManager: IProjectManager, private itemTypeManager: IItemTypeManager, private itemStateManager: IItemStateManager, private itemRelationshipManager: IItemRelationshipManager, userLogManager: IUserLogManager, dateTimeService: IDateTimeService) {
    super(itemManager, userLogManager, dateTimeService);
  }

  readonly name = 'items';

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
      if (!PermissionHelper.hasPermission(permissions, `project.${access}`, { projectId: entity.project.id }))
        return false;

    return entity.createdBy.id === user.id;
  }

  checkChangeAccess(change: IItem, user: IUser, permissions: IPermission[]) {
    if (change.project)
      if (!PermissionHelper.hasPermission(permissions, 'project.write', { projectId: change.project.id }))
        return false;

    return true;
  }

  async getSupplement(name: string, entities: IItem[]) {
    if (name === 'relationships') {
      const entityIds = entities.map(entity => entity.id);
      const filter = {
        $or: [
          { 'item1.id': { $in: entityIds } },
          { 'item2.id': { $in: entityIds } },
        ],
      };

      const relationships = await this.itemRelationshipManager.getAll(filter);

      return relationships.map(relationship => new ItemRelationshipModel(relationship));
    }

    return Promise.resolve(undefined);
  }

  async entityFromParams(params: IParams, request: IRequest) {
    return {
      ...await super.entityFromParams(params, request),
      kind: params.readString('kind'),
      type: await params.readEntity('type_id', this.itemTypeManager),
      title: params.readString('title'),
      description: params.readString('description'),
      state: await params.readEntity('state_id', this.itemStateManager),
      tags: params.readStringArray('tags'),
      project: await params.readEntity('project_id', this.projectManager),
      assignedTo: await params.readEntity('assigned_to_id', this.userManager),
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
      tags: params.readStringArray('tags'),
      project: await params.readEntity('project_id', this.projectManager),
      assignedTo: await params.readEntity('assigned_to_id', this.userManager),
      modifiedBy: request.user,
    };
  }

  entityToModel(entity: IItem) {
    if (!entity)
      return undefined;

    return new ItemModel(entity);
  }
}
