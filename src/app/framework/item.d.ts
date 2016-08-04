interface IItem extends IEntity {
  type?: string;
  title?: string;
  description?: string;
  state?: IEntity;
  project?: IEntity;
  subItems?: IEntity[];
  prerequisiteItems?: IEntity[];
  assignedUsers?: IEntity[];
}

interface IItemFilter extends IFilter {
  type?: string;
}

interface IItemChange extends IChange {
  title?: string;
  description?: string;
  state?: IEntity;
  project?: IEntity;
  subItems?: IEntity[];
  subItems_add?: IEntity[];
  subItems_remove?: IEntity[];
  prerequisiteItems?: IEntity[];
  prerequisiteItems_add?: IEntity[];
  prerequisiteItems_remove?: IEntity[];
  assignedUsers?: IEntity[];
  assignedUsers_add?: IEntity[];
  assignedUsers_remove?: IEntity[];
}

interface IItemRepository extends IRepository<IItem, IItemFilter, IItemChange> {
}