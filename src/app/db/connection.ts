import * as mongodb from 'mongodb';
import { IConnection } from './iconnection';

export class Connection implements IConnection {
  private static _db: mongodb.Db;

  constructor(private address: string) {
  }

  async open() {
    Connection._db = await mongodb.MongoClient.connect(this.address, { ignoreUndefined: true });
  }

  getDB() {
    return Connection._db;
  }

  close(): void {
    Connection._db.close();
  }
}
