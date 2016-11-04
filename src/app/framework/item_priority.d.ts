interface IItemPriority extends IEntity {
  title?: string;
  key?: string;
  order?: number;
}

interface IItemPriorityFilter extends IFilter {
}

interface IItemPriorityChange extends IChange {
  title?: string;
  key?: string;
  order?: number;
}

interface IItemPriorityRepository extends IRepository<IItemPriority, IItemPriorityFilter, IItemPriorityChange> {
}