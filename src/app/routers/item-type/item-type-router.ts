import { RouterBase } from '../router-base';
import { IItemType, IItemTypeManager, IItemTypeFilter, IItemTypeChange } from '../../framework/item-type';
import { IRequest } from '../../irequest';
import { IParams } from '../iparams';
import { IItemTypeModel } from './iitem-type-model';

export class ItemTypeRouter extends RouterBase<IItemType, IItemTypeFilter, IItemTypeChange, IItemTypeModel> {
  constructor(projectManager: IItemTypeManager) {
    super(projectManager);
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

  entityToModel(entity: IItemType): IItemTypeModel {
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
