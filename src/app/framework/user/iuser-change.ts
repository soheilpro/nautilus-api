import { IChange } from '../ichange';

export interface IUserChange extends IChange {
  username?: string;
  passwordHash?: string;
  name?: string;
  email?: string;
}
