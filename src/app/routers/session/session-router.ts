import * as restify from 'restify';
import { RouterBase } from '../router-base';
import { ISession, ISessionManager, ISessionFilter, ISessionChange } from '../../framework/session';
import { IUserManager } from '../../framework/user';
import { IRequest } from '../../irequest';
import { IResponse } from '../../iresponse';
import Params from '../params';
import { ISessionModel } from './isession-model';

export class SessionRouter extends RouterBase<ISession, ISessionFilter, ISessionChange, ISessionModel> {
  constructor(private sessionManager: ISessionManager, private userManager: IUserManager) {
    super(sessionManager);

    this.postEntity = this.postEntity.bind(this);
  }

  getRoutes() {
    return [
      this.route('post', '/sessions', this.postEntity),
    ];
  }

  protected async postEntity(request: IRequest, response: IResponse) {
    const params = new Params(request);
    const username = params.readString('username');
    const password = params.readString('password');

    if (!username)
      return response.send(new restify.UnprocessableEntityError('Missing username.'));

    if (!password)
      return response.send(new restify.UnprocessableEntityError('Missing password.'));

    const user = await this.userManager.get({ username: username });

    if (!user || !this.userManager.testPassword(password, user.passwordHash))
        return response.send(new restify.UnauthorizedError());

    const session: ISession = {
      user: user,
    };

    const validationError = this.sessionManager.validateEntity(session);

    if (validationError)
      return response.send(new restify.UnprocessableEntityError(validationError.message));

    const insertedEntity = await this.sessionManager.insert(session);
    const data = this.entityToModel(insertedEntity);

    response.status(201);
    response.send({
      data: data,
    });
  }

  entityToModel(entity: ISession): ISessionModel {
    if (!entity)
      return undefined;

    return {
      ...super.entityToModel(entity),
      accessToken: entity.accessToken,
      user: this.renderEntity(entity.user),
    };
  }
}
