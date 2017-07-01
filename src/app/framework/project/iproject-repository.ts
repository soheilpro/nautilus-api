import { IRepository } from '../irepository';
import { IProject } from './iproject';
import { IProjectFilter } from './iproject-filter';
import { IProjectChange } from './iproject-change';

export interface IProjectRepository extends IRepository<IProject, IProjectFilter, IProjectChange> {
}
