import { IProject } from '../framework/project';
import { IUserRole } from '../framework/user-role';
import { IPermission } from '../framework/security';

export class PermissionManager {
  static async getUserPermissions(userRoles: IUserRole[], projects: IProject[]): Promise<IPermission[]> {
    let permissions: IPermission[] = [];

    for (const userRole of userRoles)
      permissions = [...permissions, ...Array.from(this.getPermissions(userRole, projects))];

    return permissions;
  }

  private static * getPermissions(userRole: IUserRole, projects: IProject[]): IterableIterator<IPermission> {
    yield { name: 'projects.read'};
    yield { name: 'user-roles.read'};
    yield { name: 'users.read'};

    switch (userRole.name) {
      case 'admin':
        yield { name: 'projects.write'};
        yield { name: 'user-roles.write'};
        yield { name: 'users.write'};
        break;

      case 'project.master':
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

      case 'project.member':
        yield { name: 'project.read',  params: { projectId: userRole.project.id } };
        yield { name: 'project.write', params: { projectId: userRole.project.id } };
        break;
    }
  }
}
