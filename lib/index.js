const winston = require('winston');
const redis = require('redis');

const config = require('../config.js');

const User = require('./User');
const UsersStore = require('./UsersStore');
const MessagesStore = require('./MessagesStore');

const {
  addUser,
  broadcastUpdates,
  onMessage,
  onDisconnect
} = require('./chat');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true
    })
  ]
});

module.exports = function chat(io) {
  if (!io) {
    logger.log('error', 'no io provided');
    return;
  }

  const memory = redis.createClient({
    host: config.get('redis.host'),
    port: config.get('redis.port')
  });

  const messagesStore = new MessagesStore(logger, memory);

  const usersStore = new UsersStore(logger, memory);

  io.on('connection', (socket) => {
    addUser({ io, socket, user: new User(), usersStore });

    broadcastUpdates({ io, messagesStore, usersStore });

    onMessage({ io, messagesStore, socket, usersStore });

    onDisconnect({ io, socket, usersStore });
  });
};
