import { IDB } from '../db';

export interface ISchema {
  readonly version: number;
  apply(db: IDB): Promise<void>;
}
