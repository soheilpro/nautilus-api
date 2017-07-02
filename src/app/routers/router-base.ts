import * as restify from 'restify';
import { IRouter } from '../irouter';
import { IEntity, IFilter, IChange, IManager } from '../framework';
import { IRequest } from '../irequest';
import { IResponse } from '../iresponse';
import { IRoute } from './iroute';
import { IEntityModel } from './ientity-model';
import { IParams } from './iparams';
import Params from './params';

export abstract class RouterBase<TEntity extends IEntity, TFilter extends IFilter, TChange extends IChange, TEntityModel extends IEntityModel> implements IRouter {
  constructor(private manager: IManager<TEntity, TFilter, TChange>) {
    this.getEntities = this.getEntities.bind(this);
    this.getEntity = this.getEntity.bind(this);
    this.postEntity = this.postEntity.bind(this);
    this.patchEntity = this.patchEntity.bind(this);
    this.deleteEntity = this.deleteEntity.bind(this);
  }

  register(server: restify.Server) {
    for (const route of this.getRoutes())
      (server as any)[route.method](route.url, this.authorize(route.isProtected, route.permissions), route.handler);
  }

  abstract getRoutes(): IRoute[];

  protected route(method: string, url: string, handler: restify.RequestHandler) {
    return {
      method: method,
      url: url,
      handler: handler,
    };
  }

  protected protectedRoute(method: string, url: string, handler: restify.RequestHandler, permissions?: string[]) {
    return {
      method: method,
      url: url,
      handler: handler,
      isProtected: true,
      permissions: permissions,
    };
  }

  private authorize(isProtected: boolean, permissions?: string[]) {
    return (request: IRequest, response: IResponse, next: restify.Next) => {
      if (isProtected) {
        if (!request.user)
          return response.send(new restify.UnauthorizedError());

        if (permissions && permissions.length !== 0 && !permissions.every(permission => request.permissions.indexOf(permission) !== -1))
          return response.send(new restify.ForbiddenError());
      }

      next();
    };
  }

  protected async getEntities(request: IRequest, response: IResponse) {
    const params = new Params(request);
    const filter = await this.filterFromParams(params);
    const entities = await this.manager.getAll(filter);

    const data = entities.map(entity => this.entityToModel(entity));

    response.send({
      data: data,
    });
  }

  protected async getEntity(request: IRequest, response: IResponse) {
    const params = new Params(request);
    const entity = await params.readEntity('id', this.manager);

    if (!entity)
      return response.send(new restify.NotFoundError());

    const data = this.entityToModel(entity);

    response.send({
      data: data,
    });
  }

  protected async postEntity(request: IRequest, response: IResponse) {
    const params = new Params(request);
    const entity = await this.entityFromParams(params);

    const validationError = this.manager.validateEntity(entity);

    if (validationError)
      return response.send(new restify.UnprocessableEntityError(validationError.message));

    const insertedEntity = await this.manager.insert(entity);
    const data = this.entityToModel(insertedEntity);

    response.status(201);
    response.send({
      data: data,
    });
  }

  protected async patchEntity(request: IRequest, response: IResponse) {
    const params = new Params(request);
    const entity = await params.readEntity('id', this.manager);

    if (!entity)
      return response.send(new restify.NotFoundError());

    const change = await this.changeFromParams(params);

    const validationError = this.manager.validateChange(change);

    if (validationError)
      return response.send(new restify.UnprocessableEntityError(validationError.message));

    const updatedEntity = await this.manager.update(entity.id, change);
    const data = this.entityToModel(updatedEntity);

    response.send({
      data: data,
    });
  }

  protected async deleteEntity(request: IRequest, response: IResponse) {
    const params = new Params(request);
    const entity = await params.readEntity('id', this.manager);

    if (!entity)
      return response.send(new restify.NotFoundError());

    await this.manager.delete(entity.id);

    response.send(200);
  }

  protected filterFromParams(params: IParams) {
    return Promise.resolve({} as TFilter);
  }

  protected entityFromParams(params: IParams) {
    return Promise.resolve({} as TEntity);
  }

  protected changeFromParams(params: IParams) {
    return Promise.resolve({} as TChange);
  }

  protected entityToModel(entity: TEntity) {
    if (!entity)
      return undefined;

    return this.renderEntity(entity, true);
  }

  protected renderEntity(entity: TEntity, includeMeta?: boolean) {
    if (!entity)
      return undefined;

    const result = {
      id: entity.id,
    } as TEntityModel;

    if (includeMeta) {
      result.meta = {
        version: entity.meta.version,
        state: entity.meta.state,
        insertDateTime: this.renderDateTime(entity.meta.insertDateTime),
        updateDateTime: this.renderDateTime(entity.meta.updateDateTime),
        deleteDateTime: this.renderDateTime(entity.meta.deleteDateTime),
      };
    }

    return result;
  }

  protected renderDateTime(date: Date) {
    if (!date)
      return undefined;

    return date.getTime();
  }
}
