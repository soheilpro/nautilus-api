import * as restify from 'restify';
import { IUserManager } from '../framework/user';
import { IRequest } from '../irequest';
import { IResponse } from '../iresponse';

export function authenticator(userManager: IUserManager) {
  return async (request: IRequest, response: IResponse, next: restify.Next) => {
    if (request.authorization.basic) {
      const filter = { username: request.authorization.basic.username };
      const user = await userManager.get(filter);

      if (user && userManager.testPassword(request.authorization.basic.password, user.passwordHash)) {
        request.user = user;
        request.permissions = [];
      }
    }

    next();
  };
}
