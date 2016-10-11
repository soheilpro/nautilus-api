interface IItemType extends IEntity {
  itemKind?: string;
  title?: string;
  key?: string;
  order?: number;
}

interface IItemTypeFilter extends IFilter {
}

interface IItemTypeChange extends IChange {
  itemKind?: string;
  title?: string;
  key?: string;
  order?: number;
}

interface IItemTypeRepository extends IRepository<IItemType, IItemTypeFilter, IItemTypeChange> {
}