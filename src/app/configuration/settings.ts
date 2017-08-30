import { configuration } from './configuration';
import { ISettings } from './isettings';

export const settings: ISettings = {
  server: {
    port: Number(configuration.get('port')),
  },
  db: {
    address: configuration.get('db.address'),
  },
};
