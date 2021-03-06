import { IChange } from '../ichange';
import { IEntity } from '../ientity';

export interface IItemChange extends IChange {
  type?: IEntity;
  title?: string;
  description?: string;
  state?: IEntity;
  tags?: string[];
  project?: IEntity;
  assignedTo?: IEntity;
  modifiedBy?: IEntity;
}
