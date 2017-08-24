import { RouterBase } from '../router-base';
import { IItemState, IItemStateManager, IItemStateFilter, IItemStateChange } from '../../framework/item-state';
import { IUserLogManager } from '../../framework/user-log';
import { IDateTimeService } from '../../framework/system';
import { IRequest } from '../../irequest';
import { IParams } from '../iparams';
import { IItemStateModel } from './iitem-state-model';

export class ItemStateRouter extends RouterBase<IItemState, IItemStateFilter, IItemStateChange, IItemStateModel> {
  constructor(itemStateManager: IItemStateManager, userLogManager: IUserLogManager, dateTimeService: IDateTimeService) {
    super(itemStateManager, userLogManager, dateTimeService);
  }

  getName() {
    return 'item-states';
  }

  getRoutes() {
    return [
      this.protectedRoute('get',   '/itemstates',     this.getEntities,  ['item-states.read']),
      this.protectedRoute('get',   '/itemstates/:id', this.getEntity,    ['item-states.read']),
      this.protectedRoute('post',  '/itemstates',     this.postEntity,   ['item-states.write']),
      this.protectedRoute('patch', '/itemstates/:id', this.patchEntity,  ['item-states.write']),
      this.protectedRoute('del',   '/itemstates/:id', this.deleteEntity, ['item-states.write']),
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

  entityToModel(entity: IItemState): IItemStateModel {
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
