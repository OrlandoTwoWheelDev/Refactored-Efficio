import express from 'express';
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

router.get('/', getHomePage);
router.get('/dashboard', getDashboardPage);
router.get('/newproject', getNewProjectPage);
router.get('/newtask', getNewTaskPage);
router.get('/chat', getChatPage);
router.get('/myaccount', getMyAccountPage);
router.get('/team', getTeamPage);
router.get('/login', getLoginPage);
router.get('/register', getRegisterPage);

export default router;