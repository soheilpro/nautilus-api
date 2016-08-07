interface IItemState extends IEntity {
  title?: string;
  type?: string;
  color?: string;
}

interface IItemStateFilter extends IFilter {
}

interface IItemStateChange extends IChange {
  title?: string;
  type?: string;
  color?: string;
}

interface IItemStateRepository extends IRepository<IItemState, IItemStateFilter, IItemStateChange> {
}