const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const UsersStore = require('../lib/UsersStore');

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

const memory = {
  get: sandbox.stub(),
  set: sandbox.stub()
};

describe('Given a Users store', () => {
  let callback, usersStore;

  const USERS = {
    testA: MOCK_USER,
    testB: MOCK_USER
  };

  const STRING_USERS = JSON.stringify(USERS);

  const ERROR = 'test error';

  before(() => {
    callback = sandbox.stub();
    usersStore = new UsersStore(logger, memory);
  });

  afterEach(function () {
    sandbox.reset();
  });

  describe('When invoking logError', () => {
    const FIRM = 'test';

    beforeEach(() => {
      usersStore.logError(FIRM, ERROR, callback);
    });

    it('Should log an error', () => {
      expect(logger.log).to.be.calledOnce
        .and.to.be.calledWith('error', 'UsersStore.' + FIRM, ERROR);
    });

    it('Should invoke the callback passign the error', () => {
      expect(callback).to.be.calledOnce
       .and.to.be.calledWith(ERROR);
    });
  });

  describe('When setting the users', () => {
    beforeEach(() => {
      usersStore.logError = sandbox.spy();
      usersStore.setUsers(USERS);
    });

    describe('and users is empty', () => {
      it('Should log an error', () => {
        expect(usersStore.logError).to.not.be.called
          .and.to.be.calledWith('setUsers', 'empty users');
      });
    });

    describe('and users is NOT empty', () => {
      it('Should update the memory', () => {
        expect(usersStore.logError).to.not.be.called;
        expect(memory.set).to.be.calledOnce
          .and.to.be.calledWith('users', STRING_USERS);
      });
    });
  });

  describe('When getting all the users', () => {
    beforeEach(() => {
      usersStore.logError = sandbox.spy();
      memory.get = sinon.stub().callsArgWith(1, null, STRING_USERS);
    });

    describe('and an error is raised', () => {
      beforeEach(() => {
        memory.get = sinon.stub().callsArgWith(1, ERROR);
      });

      it('Should be logged', () => {
        usersStore.getAll(callback);

        expect(usersStore.logError).to.be.called
          .and.to.be.calledWith('getAll', ERROR);
      });
    });

    it('Should return the users', () => {
      usersStore.getAll(callback);

      expect(memory.get).to.be.calledOnce
        .and.to.be.calledWith('users');
      expect(usersStore.logError).to.not.be.called;
      expect(callback).to.be.calledOnce
        .and.to.be.calledWith(null, USERS);
    });
  });

  describe('When adding an invalid user', () => {
    before(() => {
      usersStore.add();
    });

    it('Should log an error', () => {
      expect(usersStore.logError).to.be.called
        .and.to.be.calledWith('add', 'empty user');
    });
  });

  describe('When adding a valid user', () => {
    beforeEach(() => {
      usersStore.getAll = sandbox.stub().callsArgWith(0, null, {});
      usersStore.setUsers = sandbox.stub();
    });

    describe('and an error is raised', () => {
      beforeEach(() => {
        usersStore.getAll = sandbox.stub().callsArgWith(0, ERROR);
        usersStore.add(MOCK_USER, callback);
      });

      it('Should be logged', () => {
        expect(usersStore.logError).to.be.calledOnce
          .and.to.be.calledWith('add', ERROR, callback);
      });
    });

    it('Should set the new user', () => {
      usersStore.add(MOCK_USER, callback);

      expect(usersStore.logError).to.not.be.called;
      expect(usersStore.setUsers).to.be.calledOnce
        .and.to.be.calledWith({ [MOCK_USERNAME]: MOCK_USER}, callback);
    });
  });

  describe('When deleting an invalid username', () => {
    before(() => {
      usersStore.delete();
    });

    it('Should log an error', () => {
      expect(usersStore.logError).to.be.called
        .and.to.be.calledWith('delete', 'empty username');
    });
  });

  describe('When deleting a valid user', () => {
    beforeEach(() => {
      usersStore.getAll = sandbox.stub().callsArgWith(0, null, {
        [MOCK_USERNAME]: MOCK_USER
      });
      usersStore.setUsers = sandbox.stub();
    });

    describe('and an error is raised', () => {
      beforeEach(() => {
        usersStore.getAll = sandbox.stub().callsArgWith(0, ERROR);
        usersStore.delete(MOCK_USER, callback);
      });

      it('Should be logged', () => {
        expect(usersStore.logError).to.be.calledOnce
          .and.to.be.calledWith('delete', ERROR, callback);
      });
    });

    it('Should delete the user', () => {
      usersStore.delete(MOCK_USERNAME, callback);

      expect(usersStore.logError).to.not.be.called;
      expect(usersStore.setUsers).to.be.calledOnce
        .and.to.be.calledWith({}, callback);
    });
  });

  describe('When getting an invalid username', () => {
    before(() => {
      usersStore.get();
    });

    it('Should log an error', () => {
      expect(usersStore.logError).to.be.called
        .and.to.be.calledWith('get', 'empty username');
    });
  });

  describe('When getting a valid user', () => {
    beforeEach(() => {
      usersStore.getAll = sandbox.stub().callsArgWith(0, null, {
        [MOCK_USERNAME]: MOCK_USER
      });
    });

    describe('and an error is raised', () => {
      beforeEach(() => {
        usersStore.getAll = sandbox.stub().callsArgWith(0, ERROR);
        usersStore.get(MOCK_USER, callback);
      });

      it('Should be logged', () => {
        expect(usersStore.logError).to.be.calledOnce
          .and.to.be.calledWith('get', ERROR, callback);
      });
    });

    it('Should return the user', () => {
      usersStore.get(MOCK_USERNAME, callback);

      expect(usersStore.logError).to.not.be.called;
      expect(callback).to.be.calledOnce
        .and.to.be.calledWith(null, MOCK_USER);
    });
  });
});
