import { IEntityModel } from '../ientity-model';

export interface IItemPriorityModel extends IEntityModel {
  itemKind?: string;
  title?: string;
  key?: string;
  order?: number;
}
