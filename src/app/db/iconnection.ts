import * as mongodb from 'mongodb';

export interface IConnection {
  open(): void;
  getDB(): mongodb.Db;
  close(): void;
}
