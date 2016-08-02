/// <reference path="./typings/index.d.ts" />

import { DB, Update } from './db';

var _ = require('underscore');

export class Repository {
  private db;

  constructor() {
    this.db = new DB();
  }

  getUsers(filter, callback) {
    var query = {};

    this.db.find('users', query, null, null, (error, result) => {
      if (error)
        return callback(error);

      var users = _.map(result, this.documentToUser, this);
      callback(null, users);
    });
  };

  getUser(filter, callback) {
    var query = {
      _id: filter.userId ? DB.ObjectId(filter.userId) : undefined,
      username: filter.username
    };

    this.db.findOne('users', query, null, (error, result) => {
      if (error)
        return callback(error);

      if (!result)
        return callback(null, null);

      var user = this.documentToUser(result);
      callback(null, user);
    });
  };

  insertUser(user, callback) {
    var document = this.userToDocument(user);

    this.db.insert('users', document, (error) => {
      if (error)
        return callback(error);

      var user = this.documentToUser(document);
      callback(null, user);
    });
  };

  updateUser(userId, change, callback) {
    var update = new Update();
    update.setOrUnset('username', change.username);
    update.setOrUnset('passwordHash', change.passwordHash);
    update.setOrUnset('name', change.name);

    this.db.findAndModify('users', {_id: DB.ObjectId(userId)}, update.value(), {new: true}, (error, result) => {
      if (error)
        return callback(error);

      var user = this.documentToUser(result.value);
      callback(null, user);
    });
  };

  getSession(filter, callback) {
    var query = {
      _id: filter.sessionId
    };

    this.db.findOne('sessions', query, null, (error, result) => {
      if (error)
        return callback(error);

      if (!result)
        return callback(null, null);

      var session = this.documentToSession(result);
      callback(null, session);
    });
  };

  insertSession(session, callback) {
    var document = this.sessionToDocument(session);

    this.db.insert('sessions', document, (error) => {
      if (error)
        return callback(error);

      var session = this.documentToSession(document);
      callback(null, session);
    });
  };

  getStates(filter, callback) {
    var query = {};

    this.db.find('states', query, null, null, (error, result) => {
      if (error)
        return callback(error);

      var states = _.map(result, this.documentToState, this);
      callback(null, states);
    });
  };

  getState(filter, callback) {
    var query = {
      _id: filter.stateId ? DB.ObjectId(filter.stateId) : undefined
    };

    this.db.findOne('states', query, null, (error, result) => {
      if (error)
        return callback(error);

      if (!result)
        return callback(null, null);

      var state = this.documentToState(result);
      callback(null, state);
    });
  };

  insertState(state, callback) {
    var document = this.stateToDocument(state);

    this.db.insert('states', document,(error) => {
      if (error)
        return callback(error);

      var state = this.documentToState(document);
      callback(null, state);
    });
  };

  updateState(stateId, change, callback) {
    var update = new Update();
    update.setOrUnset('title', change.title);
    update.setOrUnset('type', change.type);
    update.setOrUnset('color', change.color);

    this.db.findAndModify('states', {_id: DB.ObjectId(stateId)}, update.value(), {new: true}, (error, result) => {
      if (error)
        return callback(error);

      var state = this.documentToState(result.value);
      callback(null, state);
    });
  };

  getProjects(filter, callback) {
    var query = {};

    this.db.find('projects', query, null, null, (error, result) => {
      if (error)
        return callback(error);

      var projects = _.map(result, this.documentToProject, this);
      callback(null, projects);
    });
  };

  getProjectById(filter, callback) {
    var query = {
      _id: filter.projectId ? DB.ObjectId(filter.projectId) : undefined
    };

    this.db.findOne('projects', query, null, (error, result) => {
      if (error)
        return callback(error);

      if (!result)
        return callback(null, null);

      var project = this.documentToProject(result);
      callback(null, project);
    });
  };

  insertProject(project, callback) {
    var document = this.projectToDocument(project);

    this.db.insert('projects', document, (error) => {
      if (error)
        return callback(error);

      var project = this.documentToProject(document);
      callback(null, project);
    });
  };

  updateProject(projectId, change, callback) {
    var update = new Update();
    update.setOrUnset('name', change.name);
    update.setOrUnset('group', change.group);

    this.db.findAndModify('projects', {_id: DB.ObjectId(projectId)}, update.value(), {new: true}, (error, result) => {
      if (error)
        return callback(error);

      var project = this.documentToProject(result.value);
      callback(null, project);
    });
  };

  getItems(filter, callback) {
    var query = {
      type: filter.type
    };

    this.db.find('items', query, null, null, (error, result) => {
      if (error)
        return callback(error);

      var items = _.map(result, this.documentToItem, this);
      callback(null, items);
    });
  };

  getItem(filter, callback) {
    var query = {
      _id: filter.itemId ? DB.ObjectId(filter.itemId) : undefined
    };

    this.db.findOne('items', query, null, (error, result) => {
      if (error)
        return callback(error);

      if (!result)
        return callback(null, null);

      var item = this.documentToItem(result);
      callback(null, item);
    });
  };

  insertItem(item, callback) {
    var document = this.itemToDocument(item);

    this.db.insert('items', document, (error) => {
      if (error)
        return callback(error);

      var item = this.documentToItem(document);
      callback(null, item);
    });
  };

  updateItem(itemId, change, callback) {
    var update = new Update();
    update.setOrUnset('title', change.title);
    update.setOrUnset('description', change.description);
    update.setOrUnset('state', change.state, this.toRef.bind(this));
    update.setOrUnset('project', change.project, this.toRef.bind(this));
    update.setOrUnset('prerequisiteItems', change.prerequisiteItems, this.toRefArray.bind(this));
    update.addToSet('prerequisiteItems', change.prerequisiteItems_add, this.toRefArray.bind(this));
    update.removeFromSet('prerequisiteItems', change.prerequisiteItems_remove, this.toRefArray.bind(this));
    update.setOrUnset('subItems', change.subItems, this.toRefArray.bind(this));
    update.addToSet('subItems', change.subItems_add, this.toRefArray.bind(this));
    update.removeFromSet('subItems', change.subItems_remove, this.toRefArray.bind(this));
    update.setOrUnset('assignedUsers', change.assignedUsers, this.toRefArray.bind(this));
    update.addToSet('assignedUsers', change.assignedUsers_add, this.toRefArray.bind(this));
    update.removeFromSet('assignedUsers', change.assignedUsers_remove, this.toRefArray.bind(this));

    this.db.findAndModify('items', {_id: DB.ObjectId(itemId)}, update.value(), {new: true}, (error, result) => {
      if (error)
        return callback(error);

      var item = this.documentToItem(result.value);
      callback(null, item);
    });
  };

  deleteItem(itemId, callback) {
    this.db.remove('items', {_id: DB.ObjectId(itemId)}, callback);
  };

  private documentToUser(document) {
    return {
      id: document._id.toString(),
      username: document.username,
      passwordHash: document.passwordHash,
      name: document.name
    };
  }

  private userToDocument(user) {
    return {
      _id: DB.ObjectId(user.id),
      username: user.username,
      passwordHash: user.passwordHash,
      name: user.name
    };
  }

  private documentToSession(document) {
    return {
      id: document._id,
      user: this.fromRef(document.user)
    };
  }

  private sessionToDocument(session) {
    return {
      _id: session.id,
      user: this.toRef(session.user)
    };
  }

  private documentToState(document) {
    return {
      id: document._id.toString(),
      title: document.title,
      type: document.type,
      color: document.color
    };
  }

  private stateToDocument(state) {
    return {
      _id: DB.ObjectId(state.id),
      title: state.title,
      type: state.type,
      color: state.color
    };
  }

  private documentToProject(document) {
    return {
      id: document._id.toString(),
      name: document.name,
      group: document.group
    };
  }

  private projectToDocument(project) {
    return {
      _id: DB.ObjectId(project.id),
      name: project.name,
      group: project.group
    };
  }

  private documentToItem(document) {
    return {
      id: document._id.toString(),
      title: document.title,
      type: document.type,
      state: this.fromRef(document.state),
      project: this.fromRef(document.project),
      subItems: this.fromRefArray(document.subItems),
      prerequisiteItems: this.fromRefArray(document.prerequisiteItems),
      assignedUsers: this.fromRefArray(document.assignedUsers)
    };
  }

  private itemToDocument(item) {
    return {
      _id: DB.ObjectId(item.id),
      title: item.title,
      type: item.type,
      state: this.toRef(item.state),
      project: this.toRef(item.project),
      subItems: this.toRefArray(item.subItems),
      prerequisiteItems: this.toRefArray(item.prerequisiteItems),
      assignedUsers: this.toRefArray(item.assignedUsers),
    };
  }

  private toRef(entity) {
    if (!entity)
      return undefined;

    return {
      _id: DB.ObjectId(entity.id),
    };
  }

  private toRefArray(entity) {
    if (!entity)
      return undefined;

    var result = _.map(entity, this.toRef, this);

    if (result.length === 0)
      return undefined;

    return result;
  }

  private fromRef(document) {
    if (!document)
      return undefined;

    return {
      id: document._id.toString()
    };
  }

  private fromRefArray(document) {
    if (!document)
      return undefined;

    var result = _.map(document, this.fromRef, this);

    if (result.length === 0)
      return undefined;

    return result;
  }
}
