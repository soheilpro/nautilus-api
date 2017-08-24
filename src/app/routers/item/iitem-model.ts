import { IEntityModel } from '../ientity-model';

export interface IItemModel extends IEntityModel {
  sid?: string;
  kind?: string;
  type?: IEntityModel;
  title?: string;
  description?: string;
  state?: IEntityModel;
  priority?: IEntityModel;
  tags?: string[];
  project?: IEntityModel;
  assignedTo?: IEntityModel;
  createdBy?: IEntityModel;
  modifiedBy?: IEntityModel;
}
