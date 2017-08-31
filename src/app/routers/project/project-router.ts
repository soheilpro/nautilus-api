import { RouterBase } from '../router-base';
import { IProject, IProjectManager, IProjectFilter, IProjectChange } from '../../framework/project';
import { IUserLogManager } from '../../framework/user-log';
import { IDateTimeService } from '../../services';
import { ProjectModel } from '../../models';
import { IRequest, IParams } from '../../web';

export class ProjectRouter extends RouterBase<IProject, IProjectFilter, IProjectChange> {
  constructor(projectManager: IProjectManager, userLogManager: IUserLogManager, dateTimeService: IDateTimeService) {
    super(projectManager, userLogManager, dateTimeService);
  }

  readonly name = 'projects';

  getRoutes() {
    return [
      this.protectedRoute('get',   '/projects',     this.getEntities,  ['projects.read']),
      this.protectedRoute('get',   '/projects/:id', this.getEntity,    ['projects.read']),
      this.protectedRoute('post',  '/projects',     this.postEntity,   ['projects.write']),
      this.protectedRoute('patch', '/projects/:id', this.patchEntity,  ['projects.write']),
      this.protectedRoute('del',   '/projects/:id', this.deleteEntity, ['projects.write']),
    ];
  }

  async entityFromParams(params: IParams, request: IRequest) {
    return {
      ...await super.entityFromParams(params, request),
      name: params.readString('name'),
      description: params.readString('description'),
      tags: params.readStringArray('tags'),
    };
  }

  async changeFromParams(params: IParams, request: IRequest) {
    return {
      ...await super.changeFromParams(params, request),
      name: params.readString('name'),
      description: params.readString('description'),
      tags: params.readStringArray('tags'),
    };
  }

  entityToModel(entity: IProject) {
    return new ProjectModel(entity);
  }
}
