const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const MessagesStore = require('../lib/Messages.store');

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

describe('Given a Messages store', () => {
  let messageStore;

  beforeEach(() => {
    messageStore = new MessagesStore(logger);
  });

  afterEach(function () {
    sandbox.reset();
  });

  describe('When initialized', () => {
    it('Should be empty', () => {
      expect(messageStore.getAll()).to.deep.equal([]);
    });
  });

  describe('When adding an invalid message', () => {
    beforeEach(() => {
      messageStore.add();
    });

    it('Should log a warning', () => {
      expect(logger.log).to.be.calledOnce
        .and.to.be.calledWith('warn', 'Messages.add', 'empty message');
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
        .and.to.be.calledWith('warn', 'Messages.add', 'empty user');
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
        .and.to.be.calledWith('warn', 'Messages.add', 'empty content');
    });
  });

  describe('When adding a valid message', () => {
    const MESSAGE = {
      content: MOCK_SAFE_CONTENT,
      user: MOCK_USER
    };

    beforeEach(() => {
      messageStore.add(MESSAGE);
    });

    it('Should store the message', () => {
      const { content, user } = messageStore.getAll()[0];

      expect(content).to.equal(MESSAGE.content);
      expect(user).to.deep.equal(MESSAGE.user);
    });
  });

  describe('When trying to add an unsafe message', () => {
    const MESSAGE = {
      content: MOCK_UNSAFE_CONTENT,
      user: MOCK_USER
    };

    beforeEach(() => {
      messageStore.add(MESSAGE);
    });

    it('Should store a sanitized message', () => {
      const { content } = messageStore.getAll()[0];

      expect(content).to.equal(MOCK_SAFE_CONTENT);
    });
  });

  describe('When adding too many messageStore', () => {
    const MESSAGE = {
      content: MOCK_SAFE_CONTENT,
      user: MOCK_USER
    };

    const LAST_MESSAGE = {
      content: 'last',
      user: MOCK_USER
    };

    let messages;

    beforeEach(() => {
      messageStore.limit = 5;

      for(let i = 0; i <= messageStore.limit; i++) {
        messageStore.add(MESSAGE);
      }

      messageStore.add(LAST_MESSAGE);

      messages = messageStore.getAll();
    });

    it('Should respect the messages limit size', () => {
      expect(messages.length).to.equal(messageStore.limit);
    });

    it('Should keep the latest messages', () => {
      expect(messages[messages.length -1].content).to.equal(LAST_MESSAGE.content);
    });
  });
});
