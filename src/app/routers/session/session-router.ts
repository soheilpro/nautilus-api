import * as errors from 'restify-errors';
import { RouterBase } from '../router-base';
import { ISession, ISessionManager, ISessionFilter, ISessionChange } from '../../framework/session';
import { IUserManager } from '../../framework/user';
import { IUserLogManager } from '../../framework/user-log';
import { IDateTimeService } from '../../services';
import { SessionModel } from '../../models';
import { IRequest, IResponse, Params } from '../../web';

export class SessionRouter extends RouterBase<ISession, ISessionFilter, ISessionChange> {
  constructor(private sessionManager: ISessionManager, private userManager: IUserManager, userLogManager: IUserLogManager, dateTimeService: IDateTimeService) {
    super(sessionManager, userLogManager, dateTimeService);

    this.postEntity = this.postEntity.bind(this);
  }

  readonly name = 'sessions';

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
      return response.send(new errors.UnprocessableEntityError('Missing username.'));

    if (!password)
      return response.send(new errors.UnprocessableEntityError('Missing password.'));

    const user = await this.userManager.get({ username: username });

    if (!user || !this.userManager.testPassword(password, user.passwordHash))
        return response.send(new errors.UnauthorizedError());

    const session: ISession = {
      user: user,
    };

    const validationError = this.sessionManager.validateEntity(session);

    if (validationError)
      return response.send(new errors.UnprocessableEntityError(validationError.message));

    const insertedEntity = await this.sessionManager.insert(session);
    const data = this.entityToModel(insertedEntity);

    response.send(201, {
      data: data,
    });
  }

  entityToModel(entity: ISession) {
    if (!entity)
      return undefined;

    return new SessionModel(entity);
  }
}
