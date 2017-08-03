const { isEmpty, isObject, omit } = require('lodash');
const sanitizeHtml = require('sanitize-html');

const Messages = class Messages {
  constructor(logger = console) {
    this.logger = logger;

    this.messages = [];
  }

  getAll() {
    return this.messages;
  }

  add(message) {
    const { messages, logger } = this;

    if (!isObject(message) || isEmpty(message)) {
      logger.log('warn', 'Messages.add', 'empty message');
      return;
    }

    const { content, user } = message;

    if (isEmpty(user)) {
      logger.log('warn', 'Messages.add', 'empty user');
      return;
    }

    if (isEmpty(content)) {
      logger.log('warn', 'Messages.add', 'empty content');
      return;
    }

    messages.push({
      content: sanitizeHtml(content),
      user,
      datetime: Date.now()
    })
  }
};

module.exports = Messages;
