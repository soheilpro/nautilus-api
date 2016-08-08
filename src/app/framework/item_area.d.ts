interface IItemArea extends IEntity {
  title?: string;
  project?: IEntity;
}

interface IItemAreaFilter extends IFilter {
}

interface IItemAreaChange extends IChange {
  title?: string;
  project?: IEntity;
}

interface IItemAreaRepository extends IRepository<IItemArea, IItemAreaFilter, IItemAreaChange> {
}