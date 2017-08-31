import { ISession, ISessionFilter, ISessionChange, ISessionRepository } from '../../framework/session';
import { IDB } from '../../db';
import { ISessionDocument } from './isession-document';
import RepositoryBase from '../repository-base';

export class SessionRepository extends RepositoryBase<ISession, ISessionFilter, ISessionChange, ISessionDocument> implements ISessionRepository {
  constructor(db: IDB) {
    super(db);
  }

  collectionName() {
    return 'sessions';
  }

  documentToEntity(document: ISessionDocument) {
    return {
      ...super.documentToEntity(document),
      accessToken: document.accessToken,
      user: this.fromRef(document.user),
    };
  }

  entityToDocument(entity: ISession) {
    return {
      ...super.entityToDocument(entity),
      accessToken: entity.accessToken,
      user: this.toRef(entity.user),
    };
  }
}
