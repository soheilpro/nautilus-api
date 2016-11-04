import { DB, IDocument } from '../db';
import { BaseRepository, Query, Update } from './base';

interface IProjectDocument extends IDocument {
  name: string;
  tags?: string[];
}

export class ProjectRepository extends BaseRepository<IProject, IProjectFilter, IProjectChange, IProjectDocument> {
  collectionName(): string {
    return 'projects';
  }

  filterToQuery(filter: IProjectFilter): Query {
    var query = new Query();
    query.set('_id', filter, this.toObjectId.bind(this));

    return query;
  }

  changeToUpdate(change: IProjectChange): Update {
    var update = new Update();
    update.setOrUnset('name', change.name);
    update.setOrUnset('tags', change.tags);

    return update;
  }

  documentToEntity(document: IProjectDocument): IProject {
    return {
      id: document._id.toString(),
      name: document.name,
      tags: document.tags
    };
  }

  entityToDocument(entity: IProject): IProjectDocument {
    return {
      _id: DB.ObjectId(entity.id),
      name: entity.name,
      tags: entity.tags
    };
  }
}
