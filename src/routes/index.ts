import express from 'express';
import pageRoutes from './pageRoutes.js';
import apiRoutes from './apiRoutes.js';

const app = express();

app.use((req, res, next: express.NextFunction) => {
  console.log(`Incoming request to ${req.originalUrl}`);
  next();
});


const mainRouter = express.Router();

// Route all page requests (e.g., '/', '/dashboard', etc.)
mainRouter.use('/', pageRoutes);

// Route all API requests (e.g., '/api/projects', etc.)
mainRouter.use('/api', apiRoutes);

export default mainRouter;
