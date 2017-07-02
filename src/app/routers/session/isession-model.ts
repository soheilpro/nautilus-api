import { IEntityModel } from '../ientity-model';

export interface ISessionModel extends IEntityModel {
  accessToken?: string;
  user?: IEntityModel;
}
