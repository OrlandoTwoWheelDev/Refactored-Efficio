import express from 'express';
import { authToken } from '../../middleware/authToken.js';
import { getHomePage } from '../controllers/home.js';
import { getDashboardPage } from '../controllers/dashboard.js';
import { getNewProjectPage } from '../controllers/newproject.js';
import { getNewTaskPage } from '../controllers/newtask.js';
import { getChatPage } from '../controllers/chat.js';
import { getMyAccountPage } from '../controllers/myaccount.js';
import { getLoginPage } from '../controllers/login.js';
import { getRegisterPage } from '../controllers/register.js';
import { getTeamPage } from '../controllers/team.js';

const router = express.Router();

// Public Routes
router.get('/', getHomePage);
router.get('/login', getLoginPage);
router.get('/register', getRegisterPage);

// Protected Routes
router.get('/dashboard', authToken, getDashboardPage);
router.get('/newproject', authToken, getNewProjectPage);
router.get('/newtask', authToken, getNewTaskPage);
router.get('/chat', authToken, getChatPage);
router.get('/myaccount', authToken, getMyAccountPage);
router.get('/team', authToken, getTeamPage);

export default router;
