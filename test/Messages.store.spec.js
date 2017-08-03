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
  let messages;

  beforeEach(() => {
    messages = new MessagesStore(logger);
  });

  afterEach(function () {
    sandbox.reset();
  });

  describe('When initialized', () => {
    it('Should be empty', () => {
      expect(messages.getAll()).to.deep.equal([]);
    });
  });

  describe('When adding an invalid message', () => {
    beforeEach(() => {
      messages.add();
    });

    it('Should log a warning', () => {
      expect(logger.log).to.be.calledOnce
        .and.to.be.calledWith('warn', 'Messages.add', 'empty message');
    });
  });

  describe('When adding an invalid message.user', () => {
    beforeEach(() => {
      messages.add({
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
      messages.add({
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
      messages.add(MESSAGE);
    });

    it('Should store the message', () => {
      const { content, user } = messages.getAll()[0];

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
      messages.add(MESSAGE);
    });

    it('Should store a sanitized message', () => {
      const { content } = messages.getAll()[0];

      expect(content).to.equal(MOCK_SAFE_CONTENT);
    });
  });
});
