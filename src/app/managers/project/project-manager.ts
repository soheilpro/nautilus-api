import { IProject, IProjectFilter, IProjectChange, IProjectManager, IProjectRepository } from '../../framework/project';
import ManagerBase from '../manager-base';

const NameRegEx = /.+/;

export class ProjectManager extends ManagerBase<IProject, IProjectFilter, IProjectChange> implements IProjectManager {
  constructor(repository: IProjectRepository) {
    super(repository);
  }

  validateEntity(entity: IProject) {
    if (entity.name === undefined)
      return { message: 'Missing name.' };

    if (!NameRegEx.test(entity.name))
      return { message: 'Invalid name.' };

    return null;
  }

  validateChange(change: IProjectChange) {
    if (change.name !== undefined) {
      if (!NameRegEx.test(change.name))
        return { message: 'Invalid name.' };
    }

    return null;
  }
}
