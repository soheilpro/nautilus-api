interface IProject extends IEntity {
  name?: string;
  group?: string;
}

interface IProjectFilter extends IFilter {
}

interface IProjectChange extends IChange {
  name?: string;
  group?: string;
}

interface IProjectRepository extends IRepository<IProject, IProjectFilter, IProjectChange> {
}