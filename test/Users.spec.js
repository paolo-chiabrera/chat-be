const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const UsersStore = require('../lib/Users.store');

const {
  MOCK_USERNAME,
  MOCK_USER
} = require('./mocks');

chai.use(sinonChai);

const { expect } = chai;

const sandbox = sinon.sandbox.create();

const logger = {
  log: sandbox.stub()
};

describe('Given a Users store', () => {
  let users;

  before(() => {
    users = new UsersStore(logger);
  });

  afterEach(function () {
    sandbox.reset();
  });

  describe('When initialized', () => {
    it('Should be empty', () => {
      expect(users.getAll()).to.deep.equal({});
    });
  });

  describe('When getting an invalid user', () => {
    before(() => {
      users.get();
    });

    it('Should log a warning', () => {
      expect(logger.log).to.be.calledOnce
        .and.to.be.calledWith('warn', 'Users.get', 'empty username');
    });
  });

  describe('When adding an invalid user', () => {
    before(() => {
      users.add();
    });

    it('Should log a warning', () => {
      expect(logger.log).to.be.calledOnce
        .and.to.be.calledWith('warn', 'Users.add', 'empty user');
    });
  });

  describe('When adding a valid user', () => {
    before(() => {
      users.add(MOCK_USER);
    });

    it('Should be returned as part of getAll', () => {
      expect(users.getAll()).to.deep.equal({
        [MOCK_USERNAME]: MOCK_USER
      });
    });

    it('Should be returned as part of get', () => {
      expect(users.get(MOCK_USERNAME)).to.deep.equal(MOCK_USER);
    });
  });

  describe('When deleting an invalid username', () => {
    before(() => {
      users.add(MOCK_USER);
      users.delete();
    });

    it('Should log a warning', () => {
      expect(logger.log).to.be.calledOnce
        .and.to.be.calledWith('warn', 'Users.delete', 'empty username');
    });
  });

  describe('When deleting a valid user', () => {
    before(() => {
      users.add(MOCK_USER);
      users.delete(MOCK_USERNAME);
    });

    it('Should not be stored anymore', () => {
      expect(users.get(MOCK_USERNAME)).to.be.undefined;
    });
  });
});
