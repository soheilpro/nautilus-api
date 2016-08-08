interface IItem extends IEntity {
  sid?: string;
  type?: IEntity;
  title?: string;
  description?: string;
  state?: IEntity;
  priority?: IEntity;
  project?: IEntity;
  subItems?: IEntity[];
  prerequisiteItems?: IEntity[];
  assignedUsers?: IEntity[];
  creator?: IEntity;
  creationDateTime?: Date;
  modificationDateTime?: Date;
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
  subItems?: IEntity[];
  subItems_add?: IEntity[];
  subItems_remove?: IEntity[];
  prerequisiteItems?: IEntity[];
  prerequisiteItems_add?: IEntity[];
  prerequisiteItems_remove?: IEntity[];
  assignedUsers?: IEntity[];
  assignedUsers_add?: IEntity[];
  assignedUsers_remove?: IEntity[];
  modificationDateTime?: Date;
}

interface IItemRepository extends IRepository<IItem, IItemFilter, IItemChange> {
}