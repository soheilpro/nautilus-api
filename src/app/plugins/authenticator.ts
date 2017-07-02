import * as restify from 'restify';
import { ISessionManager, ISessionFilter } from '../framework/session';
import { IRequest } from '../irequest';
import { IResponse } from '../iresponse';

export function authenticator(sessionManager: ISessionManager) {
  return async (request: IRequest, response: IResponse, next: restify.Next) => {
    if (request.authorization.basic) {
      const userId = request.authorization.basic.username;
      const accessToken = request.authorization.basic.password;

      const filter: ISessionFilter = { accessToken: accessToken, user: { id: userId } };
      const session = await sessionManager.get(filter);

      if (session) {
        request.user = session.user;
        request.permissions = [];
      }
    }

    next();
  };
}
