import { IEntityModel } from '../ientity-model';

export interface IItemTypeModel extends IEntityModel {
  itemKind?: string;
  title?: string;
  key?: string;
  order?: number;
}
