interface ISession extends IEntity {
  user: IEntity;
}

interface ISessionFilter extends IFilter {
}

interface ISessionChange extends IChange {
}

interface ISessionRepository extends IRepository<ISession, ISessionFilter, ISessionChange> {
}