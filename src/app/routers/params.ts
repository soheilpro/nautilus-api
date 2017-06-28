import * as restify from 'restify';
import { IEntity, IManager } from '../framework';
import { IParams } from './iparams';
import { IRequest } from '../irequest';
import { IResponse } from '../iresponse';

export default class Params implements IParams {
  constructor(private request: IRequest, private response: IResponse) {
  }

  readString(name: string, options: { required?: boolean, pattern?: RegExp } = {}) {
    const value = this.request.params[name];

    if (options.required && value === undefined)
      return this.response.send(new restify.UnprocessableEntityError(`Missing parameter: ${name}`));

    if (options.pattern && value !== undefined && !options.pattern.test(value))
      return this.response.send(new restify.UnprocessableEntityError(`Invalid parameter: ${name}`));

    return value;
  }

  async readEntity<TEntity extends IEntity>(name: string, manager: IManager<TEntity, any, any>, options: { required?: boolean } = {}) {
    const id = this.request.params[name];

    if (options.required && id === undefined)
      return this.response.send(new restify.UnprocessableEntityError(`Missing parameter: ${name}`));

    const filter = { id: id };
    const entity = await manager.get(filter);

    if (options.required && !entity)
      return this.response.send(new restify.UnprocessableEntityError(`Invalid parameter: ${name}`));

    return entity;
  }

  readId(name: string, options: { required?: boolean } = {}) {
    const id = this.request.params[name];

    if (options.required && id === undefined)
      return this.response.send(new restify.UnprocessableEntityError(`Missing parameter: ${name}`));

    return id;
  }
}

export const NonEmptyRegEx = /.+/;
