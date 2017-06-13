import * as restify from 'restify';
import { IRouter } from '../../irouter';

export default class UserRouter implements IRouter {
  constructor() {
    this.getUsers = this.getUsers.bind(this);
  }

  register(server: restify.Server) {
    server.get('/users', this.getUsers);
  }

  private getUsers(request: restify.Request, response: restify.Response) {
  }
}
