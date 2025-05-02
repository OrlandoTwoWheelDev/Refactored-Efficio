import express from 'express';
import pageRoutes from './pageRoutes.js';
import apiRoutes from './apiRoutes.js';

const app = express();
const mainRouter = express.Router();

mainRouter.use('/', pageRoutes);
mainRouter.use('/api', apiRoutes);

export default mainRouter;
