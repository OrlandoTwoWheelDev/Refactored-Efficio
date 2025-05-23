import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import mainRouter from './routes/index.js';
import { initSocket } from './socket.io/socket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 10000;

const server = createServer(app);

initSocket(server);

app.use(cors());
app.use(express.json());
const clientPath = path.join(process.cwd(), 'dist/client');

app.use(express.static(clientPath));
app.use(mainRouter);

app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});


server.listen(port, () => {
  console.log(`🚀 Server + WebSocket listening at http://localhost:${port}`);
  console.log('Socket.IO server initialized');
});