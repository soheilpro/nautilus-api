import { IEntityModel } from '../ientity-model';

export interface IUserRoleModel extends IEntityModel {
  user?: IEntityModel;
  project?: IEntityModel;
  name?: string;
}
