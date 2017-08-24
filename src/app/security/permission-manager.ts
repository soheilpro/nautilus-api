import { IProject } from '../framework/project';
import { IUserRole } from '../framework/user-role';
import { IPermission } from '../framework/security';

export class PermissionManager {
  static async getUserPermissions(userRoles: IUserRole[], projects: IProject[]): Promise<IPermission[]> {
    let permissions = [
      { name: 'item-priorities.read' },
      { name: 'item-states.read' },
      { name: 'item-types.read' },
      { name: 'projects.read' },
      { name: 'user-roles.read' },
      { name: 'users.read' },
    ];

    for (const userRole of userRoles)
      permissions = [...permissions, ...Array.from(this.getPermissions(userRole, projects))];

    return permissions;
  }

  private static * getPermissions(userRole: IUserRole, projects: IProject[]): IterableIterator<IPermission> {
    switch (userRole.name) {
      case 'admin':
        yield { name: 'item-priorities.write' };
        yield { name: 'item-states.write' };
        yield { name: 'item-types.write' };
        yield { name: 'projects.write' };
        yield { name: 'user-roles.write' };
        yield { name: 'users.write' };
        break;

      case 'master':
        if (userRole.project) {
          yield { name: 'project.read',  params: { projectId: userRole.project.id } };
          yield { name: 'project.write', params: { projectId: userRole.project.id } };
        }
        else {
          for (const project of projects) {
            yield { name: 'project.read',  params: { projectId: project.id } };
            yield { name: 'project.write', params: { projectId: project.id } };
          }
        }
        break;

      case 'member':
        yield { name: 'project.read',  params: { projectId: userRole.project.id } };
        yield { name: 'project.write', params: { projectId: userRole.project.id } };
        break;
    }
  }
}
