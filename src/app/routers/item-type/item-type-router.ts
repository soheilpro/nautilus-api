import { RouterBase } from '../router-base';
import { IItemType, IItemTypeManager, IItemTypeFilter, IItemTypeChange } from '../../framework/item-type';
import { IUserLogManager } from '../../framework/user-log';
import { IDateTimeService } from '../../framework/system';
import { ItemTypeModel } from '../../models/item-type/';
import { IRequest } from '../../irequest';
import { IParams } from '../iparams';

export class ItemTypeRouter extends RouterBase<IItemType, IItemTypeFilter, IItemTypeChange> {
  constructor(itemTypeManager: IItemTypeManager, userLogManager: IUserLogManager, dateTimeService: IDateTimeService) {
    super(itemTypeManager, userLogManager, dateTimeService);
  }

  getName() {
    return 'item-types';
  }

  getRoutes() {
    return [
      this.protectedRoute('get',   '/itemtypes',     this.getEntities,  ['item-types.read']),
      this.protectedRoute('get',   '/itemtypes/:id', this.getEntity,    ['item-types.read']),
      this.protectedRoute('post',  '/itemtypes',     this.postEntity,   ['item-types.write']),
      this.protectedRoute('patch', '/itemtypes/:id', this.patchEntity,  ['item-types.write']),
      this.protectedRoute('del',   '/itemtypes/:id', this.deleteEntity, ['item-types.write']),
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

  entityToModel(entity: IItemType) {
    if (!entity)
      return undefined;

    return new ItemTypeModel(entity);
  }
}
