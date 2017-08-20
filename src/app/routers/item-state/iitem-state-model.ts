import { IEntityModel } from '../ientity-model';

export interface IItemStateModel extends IEntityModel {
  itemKind?: string;
  title?: string;
  key?: string;
  order?: number;
}
