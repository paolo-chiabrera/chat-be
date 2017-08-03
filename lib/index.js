const winston = require('winston');

const User = require('./User');
const UsersStore = require('./Users.store');
const MessagesStore = require('./Messages.store');

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

  const messagesStore = new MessagesStore(logger);

  const usersStore = new UsersStore(logger);

  io.on('connection', (socket) => {
    addUser({ socket, user: new User(), usersStore });

    broadcastUpdates({ io, messagesStore, usersStore });

    onMessage({ io, messagesStore, socket, usersStore });

    onDisconnect({ io, socket, usersStore });
  });
};
