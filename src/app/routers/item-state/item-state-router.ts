import { RouterBase } from '../router-base';
import { IItemState, IItemStateManager, IItemStateFilter, IItemStateChange } from '../../framework/item-state';
import { IParams } from '../iparams';
import { IItemStateModel } from './iitem-state-model';

export class ItemStateRouter extends RouterBase<IItemState, IItemStateFilter, IItemStateChange, IItemStateModel> {
  constructor(projectManager: IItemStateManager) {
    super(projectManager);
  }

  getRoutes() {
    return [
      this.protectedRoute('get',   '/itemstates',     this.getEntities,  ['projects.read']),
      this.protectedRoute('get',   '/itemstates/:id', this.getEntity,    ['projects.read']),
      this.protectedRoute('post',  '/itemstates',     this.postEntity,   ['projects.write']),
      this.protectedRoute('patch', '/itemstates/:id', this.patchEntity,  ['projects.write']),
      this.protectedRoute('del',   '/itemstates/:id', this.deleteEntity, ['projects.write']),
    ];
  }

  async entityFromParams(params: IParams) {
    return {
      ...await super.entityFromParams(params),
      itemKind: params.readString('item_kind'),
      title: params.readString('title'),
      key: params.readString('key'),
      order: params.readInt('order'),
    };
  }

  async changeFromParams(params: IParams) {
    return {
      ...await super.changeFromParams(params),
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
