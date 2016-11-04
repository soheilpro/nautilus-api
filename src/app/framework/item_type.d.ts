interface IItemType extends IEntity {
  title?: string;
  key?: string;
  order?: number;
}

interface IItemTypeFilter extends IFilter {
}

interface IItemTypeChange extends IChange {
  title?: string;
  key?: string;
  order?: number;
}

interface IItemTypeRepository extends IRepository<IItemType, IItemTypeFilter, IItemTypeChange> {
}