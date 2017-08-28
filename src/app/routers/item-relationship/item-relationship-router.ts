import { RouterBase } from '../router-base';
import { IItemRelationship, IItemRelationshipManager, IItemRelationshipFilter, IItemRelationshipChange } from '../../framework/item-relationship';
import { IItem, IItemManager } from '../../framework/item';
import { IPermission } from '../../framework/security';
import { IUserLogManager } from '../../framework/user-log';
import { IDateTimeService } from '../../framework/system';
import { IUser } from '../../framework/user';
import { EntityHelper } from '../../framework';
import { ItemRelationshipModel } from '../../models/item-relationship';
import { PermissionHelper } from '../../security';
import { IRequest, IParams } from '../../web';

export class ItemRelationshipRouter extends RouterBase<IItemRelationship, IItemRelationshipFilter, IItemRelationshipChange> {
  constructor(itemRelationshipManager: IItemRelationshipManager, private itemManager: IItemManager, userLogManager: IUserLogManager, dateTimeService: IDateTimeService) {
    super(itemRelationshipManager, userLogManager, dateTimeService);
  }

  getName() {
    return 'item-relationships';
  }

  getRoutes() {
    return [
      this.protectedRoute('get',   '/itemrelationships',     this.getEntities),
      this.protectedRoute('get',   '/itemrelationships/:id', this.getEntity),
      this.protectedRoute('post',  '/itemrelationships',     this.postEntity),
      this.protectedRoute('patch', '/itemrelationships/:id', this.patchEntity),
      this.protectedRoute('del',   '/itemrelationships/:id', this.deleteEntity),
    ];
  }

  checkEntityAccess(entity: IItemRelationship, access: string, user: IUser, permissions: IPermission[]) {
    if (!this.checkItemAccess(entity.item1, access, user, permissions))
      return false;

    if (!this.checkItemAccess(entity.item2, access, user, permissions))
      return false;

    return true;
  }

  checkChangeAccess(change: IItemRelationship, user: IUser, permissions: IPermission[]) {
    if (change.item1)
      if (!this.checkItemAccess(change.item1, 'write', user, permissions))
        return false;

    if (change.item2)
      if (!this.checkItemAccess(change.item2, 'write', user, permissions))
        return false;

    return true;
  }

  private async checkItemAccess(item: IItem, access: string, user: IUser, permissions: IPermission[]) {
    if (EntityHelper.isBareEntity(item))
      item = await this.itemManager.get({ id: item.id });

    if (item.project)
      return PermissionHelper.hasPermission(permissions, `project.${access}`, { projectId: item.project.id });

    return item.createdBy.id === user.id;
  }

  async entityFromParams(params: IParams, request: IRequest) {
    return {
      ...await super.entityFromParams(params, request),
      item1: await params.readEntity('item1_id', this.itemManager),
      item2: await params.readEntity('item2_id', this.itemManager),
      type: params.readString('type'),
    };
  }

  async changeFromParams(params: IParams, request: IRequest) {
    return {
      ...await super.changeFromParams(params, request),
      item1: await params.readEntity('item1_id', this.itemManager),
      item2: await params.readEntity('item2_id', this.itemManager),
      type: params.readString('type'),
    };
  }

  entityToModel(entity: IItemRelationship) {
    if (!entity)
      return undefined;

    return new ItemRelationshipModel(entity);
  }
}
