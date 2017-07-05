import { IDateTimeService } from '../../framework/system';

export class DateTimeService implements IDateTimeService {
  nowUTC() {
    return new Date();
  }
}
