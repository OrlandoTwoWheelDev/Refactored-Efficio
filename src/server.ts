// server.ts
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
const port = parseInt(process.env.PORT || '10000', 10);

const server = createServer(app);

initSocket(server);

app.use(cors({origin: '*'}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist/client')));
app.use(mainRouter);

app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(__dirname, '../dist/client/index.html'));
});

server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server + WebSocket listening at http://localhost:${port}`);
  console.log('Socket.IO server initialized');
});
