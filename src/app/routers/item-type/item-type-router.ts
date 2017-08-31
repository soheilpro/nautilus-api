import { RouterBase } from '../router-base';
import { IItemType, IItemTypeManager, IItemTypeFilter, IItemTypeChange } from '../../framework/item-type';
import { IUserLogManager } from '../../framework/user-log';
import { IDateTimeService } from '../../services';
import { ItemTypeModel } from '../../models/item-type/';
import { IRequest, IParams } from '../../web';

export class ItemTypeRouter extends RouterBase<IItemType, IItemTypeFilter, IItemTypeChange> {
  constructor(itemTypeManager: IItemTypeManager, userLogManager: IUserLogManager, dateTimeService: IDateTimeService) {
    super(itemTypeManager, userLogManager, dateTimeService);
  }

  readonly name = 'item-types';

  getRoutes() {
    return [
      this.protectedRoute('get',   '/item-types',     this.getEntities,  ['item-types.read']),
      this.protectedRoute('get',   '/item-types/:id', this.getEntity,    ['item-types.read']),
      this.protectedRoute('post',  '/item-types',     this.postEntity,   ['item-types.write']),
      this.protectedRoute('patch', '/item-types/:id', this.patchEntity,  ['item-types.write']),
      this.protectedRoute('del',   '/item-types/:id', this.deleteEntity, ['item-types.write']),
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
