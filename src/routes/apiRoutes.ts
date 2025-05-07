import Express from "express";
import { getProjects, createProject, updateProject, deleteProject, getProjectsByTeam } from "../controllers/newproject.js";
import { getTasks, createTask, updateTask, deleteTask, getTasksByProject, getTasksByTeam } from "../controllers/newtask.js";
import { getChat } from "../controllers/chat.js";
import { loginUser } from "../controllers/login.js";
import { registerUser } from "../controllers/register.js";
import { getAccountInfo, updateAccountInfo, deleteAccountInfo } from "../controllers/myaccount.js";
import { getDashboardInfo } from "../controllers/dashboard.js";
import { getTeams, createTeam, updateTeam, deleteTeam, assignUserToTeam } from "../controllers/team.js";
import { authToken } from "../../middleware/authToken.js";

const router = Express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);


router.get('/dashboard', authToken, getDashboardInfo);
console.log('Dashboard route initialized');

router.get('/projects', authToken, getProjects);
router.get('/projects/team/:teamId', authToken, getProjectsByTeam);
router.post('/projects', authToken, createProject);
router.put('/projects/:id', authToken, updateProject);
router.delete('/projects/:id', authToken, deleteProject);

router.get('/tasks', authToken, getTasks);
router.get('/tasks/project/:projectId', authToken, getTasksByProject);
router.get('/tasks/team/:teamId', authToken, getTasksByTeam);
router.post('/tasks', authToken, createTask);
router.put('/tasks/:id', authToken, updateTask);
router.delete('/tasks/:id', authToken, deleteTask);

router.get('/chat', authToken, getChat);

router.get('/myaccount', authToken, getAccountInfo);
router.put('/myaccount', authToken, updateAccountInfo);
router.delete('/myaccount', authToken, deleteAccountInfo);

router.get('/team', authToken, getTeams);
router.post('/team', authToken, createTeam);
router.post('/team/:teamId/user/:userId', authToken, assignUserToTeam);
router.put('/team/:teamId', authToken, updateTeam);
router.delete('/team/:teamId', authToken, deleteTeam);

export default router;