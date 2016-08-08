interface ISession extends IEntity {
  accessToken?: string;
  user?: IEntity;
}

interface ISessionFilter extends IFilter {
  accessToken: string;
}

interface ISessionChange extends IChange {
}

interface ISessionRepository extends IRepository<ISession, ISessionFilter, ISessionChange> {
}