import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();

const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');
  
  const token = socket.handshake.auth.token;
  if (!token) {
    return socket.disconnect(true);
  }
  console.log("user connected with token", token);

  socket.on('newMessage', (newMessage) => {
    io.emit('newMessage', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });
});

server.listen(10000, () => {
  console.log('Server is listening on http://localhost:10000');
});
