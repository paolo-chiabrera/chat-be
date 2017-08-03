const {
  MESSAGE,
  MESSAGES,
  USER,
  USERS
} = require('./constants');

function addUser({ socket, user, usersStore }) {
  if (!socket || !user || !usersStore) {
    return;
  }

  const userData = user.get();

  usersStore.add(userData);

  socket.username = userData.username;

  socket.emit(USER, userData);
}

function broadcastUpdates({ io, messagesStore, usersStore }) {
  if (!io || !messagesStore || !usersStore) {
    return;
  }

  io.sockets.emit(USERS, usersStore.getAll());

  io.sockets.emit(MESSAGES, messagesStore.getAll());
}

function onDisconnect({ io, socket, usersStore }) {
  if (!io || !socket || !usersStore) {
    return;
  }

  socket.on('disconnect', () => {
    usersStore.delete(socket.username);

    io.sockets.emit(USERS, usersStore.getAll());
  });
}

function onMessage({ io, messagesStore, socket, usersStore }) {
  if (!io || !messagesStore || !socket || !usersStore) {
    return;
  }

  socket.on(MESSAGE, content => {
    messagesStore.add({
      content,
      user: usersStore.get(socket.username)
    });

    io.sockets.emit(MESSAGES, messagesStore.getAll());
  });
}

module.exports = {
  addUser,
  broadcastUpdates,
  onDisconnect,
  onMessage
};
