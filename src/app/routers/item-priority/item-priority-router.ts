import { RouterBase } from '../router-base';
import { IItemPriority, IItemPriorityManager, IItemPriorityFilter, IItemPriorityChange } from '../../framework/item-priority';
import { IParams } from '../iparams';
import { IItemPriorityModel } from './iitem-priority-model';

export class ItemPriorityRouter extends RouterBase<IItemPriority, IItemPriorityFilter, IItemPriorityChange, IItemPriorityModel> {
  constructor(projectManager: IItemPriorityManager) {
    super(projectManager);
  }

  getRoutes() {
    return [
      this.protectedRoute('get',   '/itempriorities',     this.getEntities,  ['projects.read']),
      this.protectedRoute('get',   '/itempriorities/:id', this.getEntity,    ['projects.read']),
      this.protectedRoute('post',  '/itempriorities',     this.postEntity,   ['projects.write']),
      this.protectedRoute('patch', '/itempriorities/:id', this.patchEntity,  ['projects.write']),
      this.protectedRoute('del',   '/itempriorities/:id', this.deleteEntity, ['projects.write']),
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
