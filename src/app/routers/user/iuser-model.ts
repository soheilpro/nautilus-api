import { IEntityModel } from '../ientity-model';

export interface IUserModel extends IEntityModel {
  username?: string;
  name?: string;
  email?: string;
}
