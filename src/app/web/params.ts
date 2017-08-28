import { IEntity, IManager } from '../framework';
import { IParams } from './iparams';
import { IRequest } from './irequest';

export class Params implements IParams {
  constructor(private request: IRequest) {
  }

  readString(name: string) {
    const value = this.request.params[name] as string;

    if (value === undefined)
      return undefined;

    return value;
  }

  readInt(name: string) {
    const value = this.request.params[name] as string;

    if (value === undefined)
      return undefined;

    // To handle all the edge cases of parsing an integer ('', '1.1', etc.),
    // both these methods should return the same result
    const num1 = Number(value);
    const num2 = parseInt(value, 10);

    if (num1 !== num2)
      return NaN;

    return num1;
  }

  readStringArray(name: string) {
    const value = this.request.params[name] as string;

    if (value === undefined)
      return undefined;

    const items = value.split(',').filter(item => !!item);

    if (items.length === 0)
      return null;

    return items;
  }

  async readEntity<TEntity extends IEntity>(name: string, manager: IManager<TEntity, any, any>) {
    const id = this.request.params[name] as string;

    if (id === undefined)
      return undefined;

    if (!id)
      return null;

    const filter = { id: id };
    const entity = await manager.get(filter);

    return entity;
  }

  readId(name: string) {
    return this.request.params[name];
  }
}
