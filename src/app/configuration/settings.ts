import { configuration } from './configuration';
import { ISettings } from './isettings';

export const settings: ISettings = {
  port: Number(configuration.get('port')),
  db: {
    address: configuration.get('db.address'),
  },
};
