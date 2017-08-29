import * as path from 'path';
import * as nconf from 'nconf';
import { IConfig } from './iconfig';

const configuration = nconf
  .env()
  .file({ file: path.join(__dirname, '../../../config/app.json') })
  .defaults({
    'NAUTILUS_API_PORT': '3000',
    'NAUTILUS_API_DB_ADDRESS': 'mongodb://localhost:27017/nautilus',
  });

export const config: IConfig = {
  port: Number(configuration.get('NAUTILUS_API_PORT')),
  db: {
    address: configuration.get('NAUTILUS_API_DB_ADDRESS'),
  },
};
