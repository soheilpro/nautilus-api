import { IFilter } from '../ifilter';
import { IEntity } from '../ientity';

export interface IUserRoleFilter extends IFilter {
  user?: IEntity;
}
