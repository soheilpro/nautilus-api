import { BaseUpdater } from './base'

export class v1 extends BaseUpdater {
  getVersion(): number {
    return 1;
  }

  getTasks(): Function[] {
    var tasks: Function[] = [];

    tasks.push((callback: (error: Error) => void) => {
      var document = {
        name: 'Admin',
        username: 'admin',
        passwordHash: '$2a$10$WlTsJ5UA3uC0mr6k4v9qN.uzXVRgGG08gNAqGGZctK7ioaIGoHPeu'
      };

      this.db.insert('users', document, callback);
    });

    tasks.push((callback: (error: Error) => void) => {
      var document = {
        name: 'items',
        value: 0
      };

      this.db.insert('counters', document, callback);
    });

    return tasks;
  }
}
