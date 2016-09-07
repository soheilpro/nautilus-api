import { UserRoleRepository } from '../repositories/user_role';
import { ProjectRepository } from '../repositories/project';

var _ = require('underscore');

export interface IUserPermission {
  project?: IProject,
  name: string
}

export class UserPermissionHelper {
  static getUserPermissions(user: IUser, callback: (error: Error, permissions?: IUserPermission[]) => void) {
    var userRoleRepository = new UserRoleRepository();
    var filter = {
      user: user
    };

    userRoleRepository.getAll(filter, (error, userRoles) => {
      if (error)
        return callback(error);

      new ProjectRepository().getAll({}, (error, projects) => {
        if (error)
          return callback(error);

        var permissions: IUserPermission[] = _.flatten(userRoles.map(userRole => {
          if (!userRole.project) {
            if (userRole.name === 'admin')
              return { name: 'admin' };

            if (userRole.name === 'master')
              return projects.map(project => {
                return [
                  { project: { id: project.id }, name: 'view' },
                  { project: { id: project.id }, name: 'update' }
                ];
              });
          }

          if (userRole.name === 'master')
            return [
              { project: userRole.project, name: 'view' },
              { project: userRole.project, name: 'update' },
            ];

          if (userRole.name === 'member')
            return [
              { project: userRole.project, name: 'view' },
              { project: userRole.project, name: 'update' },
            ];

          return [];
        }));

        callback(null, permissions);
      });
    });
  }

  static hasPermission(permissions: IUserPermission[], project: IProject, name: string) {
    if (!project)
      return permissions.some(permission => !permission.project && permission.name === name);

    return permissions.some(permission => permission.project && permission.project.id === project.id && permission.name === name);
  }
}
