import { IEntity, IManager } from '../framework';

export interface IParams {
  readString(name: string): string;
  readEntity<TEntity extends IEntity>(name: string, manager: IManager<TEntity, any, any>): Promise<TEntity>;
  readId(name: string): string;
}
