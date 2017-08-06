const { isEmpty, noop, omit } = require('lodash');

const UsersStore = class UsersStore {
  constructor(logger = console, memory) {
    if (!memory) {
      throw new Error('MessagesStore needs memory!');
    }

    this.logger = logger;
    this.memory = memory;
  }

  logError(firm = '', error = 'error', done = noop) {
    this.logger.log('error', 'UsersStore.' + firm, error);
    done(error);
  }

  setUsers(users, done = noop) {
    if(!users) {
      this.logError('setUsers', 'invalid users');
      return;
    }

    this.memory.set('users', JSON.stringify(users), err => {
      if (err) {
        this.logError('setUsers', 'memory.set');
        return;
      }

      done(null, users);
    });
  }

  getAll(done = noop) {
    this.memory.get('users', (err, data) => {
      if (err) {
        this.logError('getAll', err, done);
        return;
      }

      done(null, JSON.parse(data) || {});
    });
  }

  add(user, done = noop) {
    if (isEmpty(user)) {
      this.logError('add', 'empty user');
      return;
    }

    this.getAll((err, users) => {
      if (err) {
        this.logError('add', err, done);
        return;
      }

      this.setUsers(Object.assign({}, users, {
        [user.username]: user
      }), done);
    });
  }

  delete(username, done = noop) {
    if (isEmpty(username)) {
      this.logError('delete', 'empty username');
      return;
    }

    this.getAll((err, users) => {
      if (err) {
        this.logError('delete', err, done);
        return;
      }

      this.setUsers(omit(users, username), done);
    });
  }

  get(username, done = noop) {
    if (isEmpty(username)) {
      this.logError('get', 'empty username');
      return;
    }

    this.getAll((err, users) => {
      if (err) {
        this.logError('get', err, done);
        return;
      }

      done(null, users[username]);
    });
  }
};

module.exports = UsersStore;
