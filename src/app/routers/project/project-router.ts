import { RouterBase } from '../router-base';
import { IProject, IProjectManager, IProjectFilter, IProjectChange } from '../../framework/project';
import { IParams } from '../iparams';
import { IProjectModel } from './iproject-model';

export class ProjectRouter extends RouterBase<IProject, IProjectFilter, IProjectChange, IProjectModel> {
  constructor(projectManager: IProjectManager) {
    super(projectManager);
  }

  getRoutes() {
    return [
      this.protectedRoute('get',   '/projects',     this.getEntities,  ['projects.read']),
      this.protectedRoute('get',   '/projects/:id', this.getEntity,    ['projects.read']),
      this.protectedRoute('post',  '/projects',     this.postEntity,   ['projects.write']),
      this.protectedRoute('patch', '/projects/:id', this.patchEntity,  ['projects.write']),
      this.protectedRoute('del',   '/projects/:id', this.deleteEntity, ['projects.write']),
    ];
  }

  async entityFromParams(params: IParams) {
    return {
      ...await super.entityFromParams(params),
      name: params.readString('name'),
      description: params.readString('description'),
      tags: params.readStringArray('tags'),
    };
  }

  async changeFromParams(params: IParams) {
    return {
      ...await super.changeFromParams(params),
      name: params.readString('name'),
      description: params.readString('description'),
      tags: params.readStringArray('tags'),
    };
  }

  entityToModel(entity: IProject): IProjectModel {
    if (!entity)
      return undefined;

    return {
      ...super.entityToModel(entity),
      name: entity.name,
      description: entity.description,
      tags: entity.tags,
    };
  }
}
