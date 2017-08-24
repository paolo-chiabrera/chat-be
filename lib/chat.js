const {
  MESSAGE,
  MESSAGES,
  SOMEONE_HAS_STOP_TYPING,
  SOMEONE_IS_TYPING,
  STOP_TYPING,
  TYPING,
  USER,
  USERS
} = require('./constants');

function addUser({ io, socket, user, usersStore }) {
  if (!io, !socket || !user || !usersStore) {
    return;
  }

  const userData = user.get();

  usersStore.add(userData, (err, users) => {
    if (err) {
      return;
    }

    socket.username = userData.username;

    socket.emit(USER, userData);

    io.sockets.emit(USERS, users);
  });
}

function broadcastUpdates({ io, messagesStore, usersStore }) {
  if (!io || !messagesStore || !usersStore) {
    return;
  }

  usersStore.getAll((err, users) => {
    if (err) {
      return;
    }

    io.sockets.emit(USERS, users);
  });

  messagesStore.getAll((err, messages) => {
    if (err) {
      return;
    }

    io.sockets.emit(MESSAGES, messages);
  });
}

function onDisconnect({ io, socket, usersStore }) {
  if (!io || !socket || !usersStore) {
    return;
  }

  socket.on('disconnect', () => {
    usersStore.delete(socket.username, (err, users) => {
      if (err) {
        return;
      }

      io.sockets.emit(USERS, users);
    });
  });
}

function onMessage({ io, messagesStore, socket, usersStore }) {
  if (!io || !messagesStore || !socket || !usersStore) {
    return;
  }

  socket.on(MESSAGE, content => {
    usersStore.get(socket.username, (err, user) => {
      if (err) {
        return;
      }

      messagesStore.add({
        content,
        user
      }, (err, messages) => {
        if (err) {
          return;
        }

        io.sockets.emit(MESSAGES, messages)
      });
    });
  });
}

function onTyping({ io, socket }) {
  if (!io || !socket) {
    return;
  }

  socket.on(TYPING, () => {
    io.sockets.emit(SOMEONE_IS_TYPING, socket.username);
  });
}

function onStopTyping({ io, socket }) {
  if (!io || !socket) {
    return;
  }

  socket.on(STOP_TYPING, () => {
    io.sockets.emit(SOMEONE_HAS_STOP_TYPING, socket.username);
  });
}

module.exports = {
  addUser,
  broadcastUpdates,
  onDisconnect,
  onMessage,
  onStopTyping,
  onTyping
};
