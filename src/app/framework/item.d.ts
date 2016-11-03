interface IItem extends IEntity {
  sid?: string;
  type?: IEntity;
  title?: string;
  description?: string;
  state?: IEntity;
  priority?: IEntity;
  project?: IEntity;
  parent?: IEntity;
  prerequisiteItems?: IEntity[];
  assignedTo?: IEntity;
  createdBy?: IEntity;
  modifiedBy?: IEntity;
}

interface IItemFilter extends IFilter {
  type?: IEntity;
}

interface IItemChange extends IChange {
  type?: IEntity;
  title?: string;
  description?: string;
  state?: IEntity;
  priority?: IEntity;
  project?: IEntity;
  parent?: IEntity;
  prerequisiteItems?: IEntity[];
  prerequisiteItems_add?: IEntity[];
  prerequisiteItems_remove?: IEntity[];
  assignedTo?: IEntity;
  modifiedBy?: IEntity;
}

interface IItemRepository extends IRepository<IItem, IItemFilter, IItemChange> {
}