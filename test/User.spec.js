const { expect } = require('chai');

const User = require('../lib/user');

describe('Given a User', () => {
  let user;

  describe('When NOT passing any username', () => {
    before(() => {
      user = new User();
    });

    it('Should have a random username and color assigned', () => {
      const { color, username } = user.get();

      expect(username).to.be.a.string;
      expect(color).to.be.a.string;
      expect(color).to.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
    });
  });

  describe('When passing a username', () => {
    const USERNAME = 'TEST';

    before(() => {
      user = new User(USERNAME);
    });

    it('Should have assigned the username and a random color', () => {
      const { color, username } = user.get();

      expect(username).to.equal(USERNAME);
      expect(color).to.be.a.string;
      expect(color).to.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
    });
  });
});
