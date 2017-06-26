import * as restify from 'restify';
import { IRouter } from '../irouter';
import { IEntity, IFilter, IChange, IManager } from '../framework';
import { IEntityModel } from './ientity-model';

export abstract class RouterBase<TEntity extends IEntity, TFilter extends IFilter, TChange extends IChange, TEntityModel extends IEntityModel> implements IRouter {
  constructor(private manager: IManager<TEntity, TFilter, TChange>) {
    this.getEntities = this.getEntities.bind(this);
    this.getEntity = this.getEntity.bind(this);
    this.postEntity = this.postEntity.bind(this);
    this.patchEntity = this.patchEntity.bind(this);
    this.deleteEntity = this.deleteEntity.bind(this);
  }

  abstract register(server: restify.Server): void;

  protected async getEntities(request: restify.Request, response: restify.Response) {
    const filter = this.filterFromRequest(request);
    const entities = await this.manager.getAll(filter);

    const data = entities.map(entity => this.entityToModel(entity));

    response.send({
      data: data,
    });
  }

  protected async getEntity(request: restify.Request, response: restify.Response) {
    const entityId = request.params['id'];
    const filter = { id: entityId } as TFilter;
    const entity = await this.manager.get(filter);

    if (!entity)
      return response.send(404);

    const data = this.entityToModel(entity);

    response.send({
      data: data,
    });
  }

  protected async postEntity(request: restify.Request, response: restify.Response) {
    const entity = this.entityFromRequest(request);

    const insertedEntity = await this.manager.insert(entity);
    const data = this.entityToModel(insertedEntity);

    response.send({
      data: data,
    });
  }

  protected async patchEntity(request: restify.Request, response: restify.Response) {
    const entityId = request.params['id'];
    const entity = await this.manager.get(entityId);

    if (!entity)
      return response.send(404);

    const change = this.changeFromRequest(request);

    const updatedEntity = await this.manager.update(entity.id, change);
    const data = this.entityToModel(updatedEntity);

    response.send({
      data: data,
    });
  }

  protected async deleteEntity(request: restify.Request, response: restify.Response) {
    const entityId = request.params['id'];
    const entity = await this.manager.get(entityId);

    if (!entity)
      return response.send(404);

    await this.manager.delete(entity.id);

    response.send(200);
  }

  protected filterFromRequest(request: restify.Request) {
    return {} as TFilter;
  }

  protected entityFromRequest(request: restify.Request) {
    return {} as TEntity;
  }

  protected changeFromRequest(request: restify.Request) {
    return {} as TChange;
  }

  protected entityToModel(entity: TEntity) {
    return {
      id: entity.id,
      meta: {
        version: entity.meta.version,
        state: entity.meta.state,
        insertDateTime: this.dateTimeToTimestamp(entity.meta.insertDateTime),
        updateDateTime: this.dateTimeToTimestamp(entity.meta.updateDateTime),
        deleteDateTime: this.dateTimeToTimestamp(entity.meta.deleteDateTime),
      },
    } as TEntityModel;
  }

  protected dateTimeToTimestamp(date: Date) {
    if (!date)
      return undefined;

    return date.getTime();
  }
}
