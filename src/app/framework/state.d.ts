interface IState extends IEntity {
  title?: string;
  type?: string;
  color?: string;
}

interface IStateFilter extends IFilter {
}

interface IStateChange extends IChange {
  title?: string;
  type?: string;
  color?: string;
}

interface IStateRepository extends IRepository<IState, IStateFilter, IStateChange> {
}