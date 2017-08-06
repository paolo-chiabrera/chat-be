const { isEmpty, isObject, noop, omit } = require('lodash');
const sanitizeHtml = require('sanitize-html');

const MessagesStore = class MessagesStore {
  constructor(logger = console, memory) {
    if (!memory) {
      throw new Error('MessagesStore needs memory!');
    }

    this.logger = logger;
    this.memory = memory;

    this.limit = 500;
  }

  getAll(done = noop) {
    this.memory.get('messages', (err, data) => {
      if (err) {
        this.logError('MessagesStore.getAll', err, done);
        return;
      }

      done(null, JSON.parse(data) || []);
    });
  }

  setMessages(messages, done = noop) {
    if(!messages) {
      this.logError('setMessages', 'invalid messages');
      return;
    }

    this.memory.set('messages', JSON.stringify(messages), err => {
      if (err) {
        this.logError('setMessages', 'memory.set', done);
        return;
      }

      done(null, messages);
    });
  }

  logError(firm = 'MessagesStore', error = 'error', done = noop) {
    this.logger.log('error', firm, error);
    done(error);
  }

  add(message, done = noop) {
    let error;

    if (!isObject(message) || isEmpty(message)) {
      this.logError('MessagesStore.add', 'empty message', done);
      return;
    }

    const { content, user } = message;

    if (isEmpty(user)) {
      this.logError('MessagesStore.add', 'empty user', done);
      return;
    }

    if (isEmpty(content)) {
      this.logError('MessagesStore.add', 'empty content', done);
      return;
    }

    this.getAll((err, messages) => {
      if (err) {
        this.logError('MessagesStore.add', err, done);
        return;
      }

      messages.push({
        content: sanitizeHtml(content),
        user,
        datetime: Date.now()
      });

      const limitMessages = messages.slice(-this.limit);

       this.setMessages(limitMessages, done);
    });
  }
};

module.exports = MessagesStore;
