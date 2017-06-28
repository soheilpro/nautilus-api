import { IEntity, IManager } from '../framework';

export interface IParams {
  readString(name: string, options?: { required?: boolean, pattern?: RegExp }): string;
  readEntity<TEntity extends IEntity>(name: string, manager: IManager<TEntity, any, any>, options?: { required?: boolean }): Promise<TEntity>;
  readId(name: string, options?: { required?: boolean }): string;
}
