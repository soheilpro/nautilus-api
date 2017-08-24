import * as restify from 'restify';
import { ISessionManager, ISessionFilter } from '../framework/session';
import { IUserRoleManager, IUserRoleFilter } from '../framework/user-role';
import { IProjectManager } from '../framework/project';
import { IRequest } from '../irequest';
import { IResponse } from '../iresponse';
import { PermissionManager } from '../security';

export function authenticator(sessionManager: ISessionManager, userRoleManager: IUserRoleManager, projectManager: IProjectManager) {
  return async (request: IRequest, response: IResponse, next: restify.Next) => {
    request.permissions = [];

    if (request.authorization.basic) {
      const userId = request.authorization.basic.username;
      const accessToken = request.authorization.basic.password;

      const sessionFilter: ISessionFilter = { accessToken: accessToken, user: { id: userId } };
      const session = await sessionManager.get(sessionFilter);

      if (session) {
        const userRoleFilter: IUserRoleFilter = { user: session.user };
        const userRoles = await userRoleManager.getAll(userRoleFilter);
        const projects = await projectManager.getAll({});
        const permissions = await PermissionManager.getUserPermissions(userRoles, projects);

        request.user = session.user;
        request.permissions = permissions;
      }
    }

    next();
  };
}
