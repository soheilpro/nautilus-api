interface IItem extends IEntity {
  sid?: string;
  kind?: string;
  type?: IEntity;
  title?: string;
  description?: string;
  state?: IEntity;
  priority?: IEntity;
  tags?: string[];
  project?: IEntity;
  assignedTo?: IEntity;
  createdBy?: IEntity;
  modifiedBy?: IEntity;
}

interface IItemFilter extends IFilter {
  kind?: string;
}

interface IItemChange extends IChange {
  type?: IEntity;
  title?: string;
  description?: string;
  state?: IEntity;
  priority?: IEntity;
  tags?: string[];
  project?: IEntity;
  assignedTo?: IEntity;
  modifiedBy?: IEntity;
}

interface IItemRepository extends IRepository<IItem, IItemFilter, IItemChange> {
}