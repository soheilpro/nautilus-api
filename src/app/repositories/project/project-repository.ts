import { IProject, IProjectFilter, IProjectChange, IProjectRepository } from '../../framework/project';
import { IDB } from '../../db';
import { IProjectDocument } from './iproject-document';
import RepositoryBase from '../repository-base';

export class ProjectRepository extends RepositoryBase<IProject, IProjectFilter, IProjectChange, IProjectDocument> implements IProjectRepository {
  constructor(db: IDB) {
    super(db);
  }

  collectionName() {
    return 'project';
  }

  changeToUpdate(change: IProjectChange) {
    const update = super.changeToUpdate(change);
    update.setOrUnset('name', change.name);
    update.setOrUnset('description', change.description);
    update.setOrUnset('tags', change.tags);

    return update;
  }

  documentToEntity(document: IProjectDocument) {
    return {
      ...super.documentToEntity(document),
      name: document.name,
      description: document.description,
      tags: document.tags,
    };
  }

  entityToDocument(entity: IProject) {
    return {
      ...super.entityToDocument(entity),
      name: entity.name,
      description: entity.description,
      tags: entity.tags,
    };
  }
}
