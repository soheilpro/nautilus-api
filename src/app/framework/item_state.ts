interface IItemState extends IEntity {
  itemKind?: string;
  title?: string;
  key?: string;
  order?: number;
}

interface IItemStateFilter extends IFilter {
}

interface IItemStateChange extends IChange {
  itemKind?: string;
  title?: string;
  key?: string;
  order?: number;
}

interface IItemStateRepository extends IRepository<IItemState, IItemStateFilter, IItemStateChange> {
}