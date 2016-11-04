interface IProject extends IEntity {
  name?: string;
  tags?: string[];
}

interface IProjectFilter extends IFilter {
}

interface IProjectChange extends IChange {
  name?: string;
  tags?: string[];
}

interface IProjectRepository extends IRepository<IProject, IProjectFilter, IProjectChange> {
}