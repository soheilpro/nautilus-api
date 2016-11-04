interface IUser extends IEntity {
  username?: string;
  passwordHash?: string;
  name?: string;
  email?: string;
}

interface IUserFilter extends IFilter {
  username?: string;
}

interface IUserChange extends IChange {
  username?: string;
  passwordHash?: string;
  name?: string;
  email?: string;
}

interface IUserRepository extends IRepository<IUser, IUserFilter, IUserChange> {
}