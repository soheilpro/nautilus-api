import { DB } from '../db';
import { BaseRepository, Query, Update, IMetaDocument } from './base';

interface IProjectDocument extends IMetaDocument {
  name: string;
  description: string;
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
    update.setOrUnset('description', change.description);
    update.setOrUnset('tags', change.tags);

    return update;
  }

  documentToEntity(document: IProjectDocument): IProject {
    return {
      id: document._id.toString(),
      name: document.name,
      description: document.description,
      tags: document.tags,
      meta: document.meta,
    };
  }

  entityToDocument(entity: IProject): IProjectDocument {
    return {
      _id: DB.ObjectId(entity.id),
      name: entity.name,
      description: entity.description,
      tags: entity.tags
    };
  }
}
