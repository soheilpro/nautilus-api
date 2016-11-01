interface IItemState extends IEntity {
  title?: string;
  key?: string;
}

interface IItemStateFilter extends IFilter {
}

interface IItemStateChange extends IChange {
  title?: string;
  key?: string;
}

interface IItemStateRepository extends IRepository<IItemState, IItemStateFilter, IItemStateChange> {
}