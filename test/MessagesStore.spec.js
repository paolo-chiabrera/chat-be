const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const MessagesStore = require('../lib/MessagesStore');

const {
  MOCK_SAFE_CONTENT,
  MOCK_UNSAFE_CONTENT,
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

const clock = sandbox.useFakeTimers();

describe('Given a MessagesStore', () => {
  const MESSAGE = {
    content: MOCK_SAFE_CONTENT,
    datetime: clock.now,
    user: MOCK_USER
  };

  let messageStore;

  beforeEach(() => {
    messageStore = new MessagesStore(logger, memory);
  });

  afterEach(() => {
    sandbox.reset();
  });

  describe('When invoking logError', () => {
    const FIRM = 'MessagesStore.test';
    const ERROR = 'test error';
    const callback = sandbox.stub();

    beforeEach(() => {
      messageStore.logError(FIRM, ERROR, callback);
    });

    it('Should log an error', () => {
      expect(logger.log).to.be.calledOnce
        .and.to.be.calledWith('error', FIRM, ERROR);
    });

    it('Should invoke the callback passign the error', () => {
      expect(callback).to.be.calledOnce
       .and.to.be.calledWith(ERROR);
    });
  });

  describe('When setting all the messages', () => {
    const MESSAGES = [ MESSAGE, MESSAGE ];

    beforeEach(() => {
      messageStore.setMessages(MESSAGES);
    });

    it('Should set the strigified version of them', () => {
      expect(memory.set).to.be.calledOnce
        .and.to.be.calledWith('messages', JSON.stringify(MESSAGES));
    });
  });

  describe('When adding an invalid message', () => {
    beforeEach(() => {
      messageStore.add();
    });

    it('Should log a warning', () => {
      expect(logger.log).to.be.calledOnce
        .and.to.be.calledWith('error', 'MessagesStore.add', 'empty message');
    });
  });

  describe('When adding an invalid message.user', () => {
    beforeEach(() => {
      messageStore.add({
        user: null
      });
    });

    it('Should log a warning', () => {
      expect(logger.log).to.be.calledOnce
        .and.to.be.calledWith('error', 'MessagesStore.add', 'empty user');
    });
  });

  describe('When adding an invalid message.content', () => {
    beforeEach(() => {
      messageStore.add({
        content: null,
        user: MOCK_USER
      });
    });

    it('Should log a warning', () => {
      expect(logger.log).to.be.calledOnce
        .and.to.be.calledWith('error', 'MessagesStore.add', 'empty content');
    });
  });

  describe('When adding a valid message', () => {
    let callback;

    beforeEach(() => {
      messageStore.getAll = sandbox.stub().callsArgWith(0, null, []);
      messageStore.setMessages = sandbox.stub();

      callback = sandbox.spy();
    });

    describe('and the content is safe', () => {
      const MESSAGE = {
        content: MOCK_SAFE_CONTENT,
        datetime: clock.now,
        user: MOCK_USER
      };

      beforeEach(() => {
        messageStore.add(MESSAGE, callback);
      });

      it('Should store the message', () => {
        expect(messageStore.setMessages).to.be.calledOnce
         .and.to.be.calledWith([ MESSAGE ], callback);
      });
    });

    describe('and the content is NOT safe', () => {
      const UNSAFE_MESSAGE = {
        content: MOCK_UNSAFE_CONTENT,
        datetime: clock.now,
        user: MOCK_USER
      };

      const SAFE_MESSAGE = {
        content: MOCK_SAFE_CONTENT,
        datetime: clock.now,
        user: MOCK_USER
      };

      beforeEach(() => {
        messageStore.add(UNSAFE_MESSAGE, callback);
      });

      it('Should store a sanitized message', () => {
        expect(messageStore.setMessages).to.be.calledOnce
         .and.to.be.calledWith([ SAFE_MESSAGE ], callback);
      });
    });
  });

  describe('When adding too many message', () => {
    const LAST_MESSAGE = {
      content: 'last',
      datetime: clock.now,
      user: MOCK_USER
    };

    let callback;

    beforeEach(() => {
      messageStore.limit = 5;

      messageStore.getAll = sandbox.stub().callsArgWith(0, null, [
        MESSAGE,
        MESSAGE,
        MESSAGE,
        MESSAGE,
        MESSAGE
      ]);
      messageStore.setMessages = sandbox.stub();

      callback = sandbox.spy();

      messageStore.add(LAST_MESSAGE, callback);
    });

    it('Should respect the limit and push the newest one at the bottom', () => {
      expect(messageStore.setMessages).to.be.calledOnce
       .and.to.be.calledWith([
         MESSAGE,
         MESSAGE,
         MESSAGE,
         MESSAGE,
         LAST_MESSAGE
       ], callback);
    });
  });
});
