import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';

export const initSocket = (httpServer: HTTPServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
  });

  io.on('connection', (socket) => {
    console.log('🔌 A user connected');

    const token = socket.handshake.auth.token;
    if (!token) {
      return socket.disconnect(true);
    }
    console.log('user connected with token', token);

    socket.on('newMessage', (newMessage) => {
      io.emit('newMessage', newMessage);
    });

    socket.on('disconnect', () => {
      console.log('❌ A user disconnected');
    });
  });
};
