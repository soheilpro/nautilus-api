import * as mongodb from 'mongodb';

export interface IConnection {
  isOpen(): boolean;
  open(): Promise<void>;
  getDB(): Promise<mongodb.Db>;
  close(): Promise<void>;
}
