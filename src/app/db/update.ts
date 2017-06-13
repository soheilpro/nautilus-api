import { IUpdate } from './iupdate';

export class Update implements IUpdate {
  private $set: {[key: string]: any} = {};
  private $unset: {[key: string]: any} = { __noop__: '' };
  private $addToSet: {[key: string]: any} = {};
  private $pull: {[key: string]: any} = {};

  setOrUnset(key: string, value: any, map?: (value: any) => any) {
    if (value === undefined)
      return;

    if (value)
      this.$set[key] = map ? map(value) : value;
    else
      this.$unset[key] = '';
  }

  addToSet(key: string, value: any, map?: (value: any) => any) {
    if (value === undefined)
      return;

    this.$addToSet[key] = { $each: map ? map(value) : value };
  }

  removeFromSet(key: string, value: any, map?: (value: any) => any) {
    if (value === undefined)
      return;

    this.$pull[key] = { $in: map ? map(value) : value };
  }
}
