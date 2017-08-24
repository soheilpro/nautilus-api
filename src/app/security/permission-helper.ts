import * as _ from 'underscore';
import { IPermission } from '../framework/security';

export class PermissionHelper {
  static hasPermission(permissions: IPermission[], name: string, params: object) {
    return permissions.some(permission => permission.name === name && _.isEqual(permission.params, params));
  }
}
