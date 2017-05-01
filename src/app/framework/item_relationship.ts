interface IItemRelationship extends IEntity {
  item1?: IEntity;
  item2?: IEntity;
  type?: string;
}

interface IItemRelationshipFilter extends IFilter {
  items?: IEntity[];
}

interface IItemRelationshipChange extends IChange {
 }

interface IItemRelationshipRepository extends IRepository<IItemRelationship, IItemRelationshipFilter, IItemRelationshipChange> {
}