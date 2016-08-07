interface IItemPriority extends IEntity {
  title?: string;
  key?: string;
}

interface IItemPriorityFilter extends IFilter {
}

interface IItemPriorityChange extends IChange {
  title?: string;
  key?: string;
}

interface IItemPriorityRepository extends IRepository<IItemPriority, IItemPriorityFilter, IItemPriorityChange> {
}