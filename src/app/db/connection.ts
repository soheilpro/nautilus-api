import * as mongodb from 'mongodb';
import { IConnection } from './iconnection';

export class Connection implements IConnection {
  private static _db: mongodb.Db;

  constructor(private address: string) {
  }

  isOpen() {
    return !!Connection._db;
  }

  async open() {
    if (!this.isOpen())
      Connection._db = await mongodb.MongoClient.connect(this.address, { ignoreUndefined: true });
  }

  async getDB() {
    await this.open();

    return Connection._db;
  }

  async close() {
    if (this.isOpen())
      Connection._db.close();
  }
}
