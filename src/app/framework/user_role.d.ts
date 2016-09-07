interface IUserRole extends IEntity {
  user?: IEntity;
  project?: IEntity;
  name?: string;
}

interface IUserRoleFilter extends IFilter {
  user?: IEntity;
  project?: IEntity;
}

interface IUserRoleChange extends IChange {
  user?: IEntity;
  project?: IEntity;
  name?: string;
}

interface IUserRoleRepository extends IRepository<IUserRole, IUserRoleFilter, IUserRoleChange> {
}
