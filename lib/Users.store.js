const { isEmpty, omit } = require('lodash');

const Users = class Users {
  constructor(logger = console) {
    this.logger = logger;

    this.users = {};
  }

  add(user) {
    if (isEmpty(user)) {
      this.logger.log('warn', 'Users.add', 'empty user');
      return;
    }

    this.users[user.username] = user;
  }

  delete(username) {
    if (isEmpty(username)) {
      this.logger.log('warn', 'Users.delete', 'empty username');
      return;
    }

    if (this.users[username]) {
      this.users = omit(this.users, username);
    }
  }

  getAll() {
    return this.users;
  }

  get(username) {
    if (isEmpty(username)) {
      this.logger.log('warn', 'Users.get', 'empty username');
      return;
    }

    return this.users[username];
  }
};

module.exports = Users;
