import * as restify from 'restify';
import { IUser } from './framework/user';
import { IPermission } from './framework/security';

export interface IRequest extends restify.Request {
  user?: IUser;
  permissions?: IPermission[];
}
