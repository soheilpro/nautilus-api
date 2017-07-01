import { IEntityModel } from '../ientity-model';

export interface IProjectModel extends IEntityModel {
  name?: string;
  description?: string;
  tags?: string[];
}
