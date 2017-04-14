interface IItemPriority extends IEntity {
  itemKind?: string;
  title?: string;
  key?: string;
  order?: number;
}

interface IItemPriorityFilter extends IFilter {
}

interface IItemPriorityChange extends IChange {
  itemKind?: string;
  title?: string;
  key?: string;
  order?: number;
}

interface IItemPriorityRepository extends IRepository<IItemPriority, IItemPriorityFilter, IItemPriorityChange> {
}