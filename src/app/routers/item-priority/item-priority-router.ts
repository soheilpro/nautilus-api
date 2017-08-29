import { RouterBase } from '../router-base';
import { IItemPriority, IItemPriorityManager, IItemPriorityFilter, IItemPriorityChange } from '../../framework/item-priority';
import { IUserLogManager } from '../../framework/user-log';
import { IDateTimeService } from '../../services';
import { ItemPriorityModel } from '../../models/item-priority/index';
import { IRequest, IParams } from '../../web';

export class ItemPriorityRouter extends RouterBase<IItemPriority, IItemPriorityFilter, IItemPriorityChange> {
  constructor(itemPriorityManager: IItemPriorityManager, userLogManager: IUserLogManager, dateTimeService: IDateTimeService) {
    super(itemPriorityManager, userLogManager, dateTimeService);
  }

  readonly name = 'item-priorities';

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

  entityToModel(entity: IItemPriority) {
    if (!entity)
      return undefined;

    return new ItemPriorityModel(entity);
  }
}
