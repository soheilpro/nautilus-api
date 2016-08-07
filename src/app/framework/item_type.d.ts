interface IItemType extends IEntity {
  title?: string;
  key?: string;
}

interface IItemTypeFilter extends IFilter {
}

interface IItemTypeChange extends IChange {
  title?: string;
  key?: string;
}

interface IItemTypeRepository extends IRepository<IItemType, IItemTypeFilter, IItemTypeChange> {
}