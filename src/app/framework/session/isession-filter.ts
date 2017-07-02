import { IFilter } from '../ifilter';
import { IEntity } from '../ientity';

export interface ISessionFilter extends IFilter {
  accessToken?: string;
  user?: IEntity;
}
