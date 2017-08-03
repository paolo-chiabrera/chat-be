const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const {
  addUser,
  broadcastUpdates,
  onDisconnect,
  onMessage
} = require('../lib/chat');

const {
  MESSAGE,
  MESSAGES,
  USER,
  USERS
} = require('../lib/constants');

const {
  MOCK_CONTENT,
  MOCK_MESSAGES,
  MOCK_USERNAME,
  MOCK_USER
} = require('./mocks');

chai.use(sinonChai);

const { expect } = chai;

const sandbox = sinon.sandbox.create();

const messagesStore = {
  add: sandbox.stub(),
  getAll: sandbox.stub().returns(MOCK_MESSAGES)
};

const usersStore = {
  add: sandbox.stub(),
  get: sandbox.stub().returns(MOCK_USER),
  getAll: sandbox.stub(),
  delete: sandbox.stub()
};

const socket = {
  emit: sandbox.stub(),
  on: sandbox.stub().callsArg(1),
  username: MOCK_USERNAME
};

const user = {
  get: sandbox.stub().returns(MOCK_USER)
};

const io = {
  sockets: {
    emit: sandbox.stub()
  }
};

describe('Given a Chat', () => {
  afterEach(function () {
    sandbox.restore();
  });

  describe('When adding a new user', () => {
    before(() => {
      addUser({ socket, user, usersStore });
    });

    it('Should create a new User', () => {
      expect(user.get).to.be.calledOnce;
    });

    it('Should add the user to the memory', () => {
      expect(usersStore.add).to.be.calledOnce;
    });

    it('Should set socket.username', () => {
      expect(socket.username).to.be.a.string;
    });

    it('Should socket.emit the new user', () => {
      expect(socket.emit).to.be.calledOnce
        .and.to.be.calledWith(USER);
    });
  });

  describe('When broadcasting updates', () => {
    before(() => {
      broadcastUpdates({ io, messagesStore, usersStore });
    });

    it('Should broadcast the USERS', () => {
      expect(usersStore.getAll).to.be.calledOnce;
      expect(io.sockets.emit).to.be.calledWith(USERS);
    });

    it('Should broadcast the MESSAGES', () => {
      expect(messagesStore.getAll).to.be.calledOnce;
      expect(io.sockets.emit).to.be.calledWith(MESSAGES);
    });
  });

  describe('When an user disconnects', () => {
    beforeEach(() => {
      onDisconnect({ io, socket, usersStore });

      socket.emit('disconnect');
    });

    it('Should removed the user from memory', () => {
      expect(usersStore.delete).to.be.calledOnce
        .and.to.be.calledWith(socket.username);
    });

    it('Should broadcast the USERS', () => {
      expect(io.sockets.emit).to.be.calledWith(USERS);
    });
  });

  describe('When an user sends a message', () => {
    beforeEach(() => {
      socket.on = sandbox.stub().callsArgWith(1, MOCK_CONTENT);

      onMessage({ io, messagesStore, socket, usersStore });

      socket.emit(MESSAGE, MOCK_CONTENT);
    });

    it('Should removed the user from memory', () => {
      expect(messagesStore.add).to.be.calledOnce
        .and.to.be.calledWith({
          content: MOCK_CONTENT,
          user: MOCK_USER
        });
      expect(usersStore.get).to.be.calledOnce
        .and.to.be.calledWith(socket.username);
    });

    it('Should broadcast all the MESSAGES', () => {
      expect(io.sockets.emit).to.be.calledWith(MESSAGES, MOCK_MESSAGES);
    });
  });
});
