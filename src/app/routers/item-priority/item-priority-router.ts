import { RouterBase } from '../router-base';
import { IItemPriority, IItemPriorityManager, IItemPriorityFilter, IItemPriorityChange } from '../../framework/item-priority';
import { IUserLogManager } from '../../framework/user-log';
import { IDateTimeService } from '../../framework/system';
import { IRequest } from '../../irequest';
import { IParams } from '../iparams';
import { IItemPriorityModel } from './iitem-priority-model';

export class ItemPriorityRouter extends RouterBase<IItemPriority, IItemPriorityFilter, IItemPriorityChange, IItemPriorityModel> {
  constructor(itemPriorityManager: IItemPriorityManager, userLogManager: IUserLogManager, dateTimeService: IDateTimeService) {
    super(itemPriorityManager, userLogManager, dateTimeService);
  }

  getName() {
    return 'item-priorities';
  }

  getRoutes() {
    return [
      this.protectedRoute('get',   '/itempriorities',     this.getEntities,  ['item-priorities.read']),
      this.protectedRoute('get',   '/itempriorities/:id', this.getEntity,    ['item-priorities.read']),
      this.protectedRoute('post',  '/itempriorities',     this.postEntity,   ['item-priorities.write']),
      this.protectedRoute('patch', '/itempriorities/:id', this.patchEntity,  ['item-priorities.write']),
      this.protectedRoute('del',   '/itempriorities/:id', this.deleteEntity, ['item-priorities.write']),
    ];
  }

  async entityFromParams(params: IParams, request: IRequest) {
    return {
      ...await super.entityFromParams(params, request),
      itemKind: params.readString('item_kind'),
      title: params.readString('title'),
      key: params.readString('key'),
      order: params.readInt('order'),
    };
  }

  async changeFromParams(params: IParams, request: IRequest) {
    return {
      ...await super.changeFromParams(params, request),
      itemKind: params.readString('item_kind'),
      title: params.readString('title'),
      key: params.readString('key'),
      order: params.readInt('order'),
    };
  }

  entityToModel(entity: IItemPriority): IItemPriorityModel {
    if (!entity)
      return undefined;

    return {
      ...super.entityToModel(entity),
      itemKind: entity.itemKind,
      title: entity.title,
      key: entity.key,
      order: entity.order,
    };
  }
}
