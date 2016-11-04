interface IItemState extends IEntity {
  title?: string;
  key?: string;
  order?: number;
}

interface IItemStateFilter extends IFilter {
}

interface IItemStateChange extends IChange {
  title?: string;
  key?: string;
  order?: number;
}

interface IItemStateRepository extends IRepository<IItemState, IItemStateFilter, IItemStateChange> {
}