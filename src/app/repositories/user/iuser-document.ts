import { IMetaDocument } from '../../db';

export interface IUserDocument extends IMetaDocument {
  username: string;
  passwordHash: string;
  name: string;
  email: string;
}
