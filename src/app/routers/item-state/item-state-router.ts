import { RouterBase } from '../router-base';
import { IItemState, IItemStateManager, IItemStateFilter, IItemStateChange } from '../../framework/item-state';
import { IUserLogManager } from '../../framework/user-log';
import { IDateTimeService } from '../../services';
import { ItemStateModel } from '../../models/item-state';
import { IRequest, IParams } from '../../web';

export class ItemStateRouter extends RouterBase<IItemState, IItemStateFilter, IItemStateChange> {
  constructor(itemStateManager: IItemStateManager, userLogManager: IUserLogManager, dateTimeService: IDateTimeService) {
    super(itemStateManager, userLogManager, dateTimeService);
  }

  readonly name = 'item-states';

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

  entityToModel(entity: IItemState) {
    if (!entity)
      return undefined;

    return new ItemStateModel(entity);
  }
}
