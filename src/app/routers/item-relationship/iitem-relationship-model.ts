import { IEntityModel } from '../ientity-model';

export interface IItemRelationshipModel extends IEntityModel {
  item1?: IEntityModel;
  item2?: IEntityModel;
  type?: string;
}
