const pool = require('./db/Pool.cjs');
require('dotenv').config();

const cors = require('cors');
const express = require('express');
const app = express();
const path = require("path");
const favicon = require("serve-favicon");

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

const homeRoutes = require('./routes/homeRoutes.cjs');
const apiRouter = require('./routes/index.cjs');
const { createServer } = require('node:http');
const server = createServer(app);
const { setupSocket } = require('./routes/services.cjs');

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  methods: ["GET", "POST", "DELETE", "PATCH"],
  credentials: true
}));

app.use(express.json());
app.use(express.static('dist'));

app.use('/', homeRoutes);
app.use('/api', apiRouter);

app.post('/seed-db', async (req, res) => {
  try {
    const { syncAndSeed } = require('./db/seed.cjs');
    await syncAndSeed();
    res.json({ message: "Database seeded successfully!" });
  } catch (error) {
    console.error("Seeding failed:", error);
    res.status(500).json({ error: "Failed to seed database" });
  }
});

setupSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});