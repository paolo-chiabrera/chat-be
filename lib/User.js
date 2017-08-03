const faker = require('faker');
const randomColor = require('randomcolor');
const { pick } = require('lodash');

class User {
  constructor(username = faker.name.firstName()) {
    this.username = username;
    this.color = randomColor({
      luminosity: 'dark'
    });
  }

  get() {
    return pick(this, [ 'color', 'username' ]);
  }
};

module.exports = User;
