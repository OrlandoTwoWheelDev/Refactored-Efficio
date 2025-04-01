const { Server } = require("socket.io");
const http = require('http');

function setupSocket(server) {
  const io = new Server(server, {
    path: "/socket.io",
    cors: {
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST", "DELETE", "PATCH"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    const token = socket.handshake.auth.token;
    if (!token) {
      return socket.disconnect(true);
    }
    console.log("User connected with token:", token);

    socket.on("newMessage", (newMessage) => {
      io.emit("newMessage", newMessage);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return io;
}

module.exports = { setupSocket };
