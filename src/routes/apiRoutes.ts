import Express from "express";
import { getProjects, createProject, updateProject, deleteProject, getProjectsByTeam } from "../controllers/newproject.js";
import { getTasks, createTask, updateTask, deleteTask, getTasksByProject, getTasksByTeam } from "../controllers/newtask.js";
import { getChat } from "../controllers/chat.js";
import { loginUser } from "../controllers/login.js";
import { registerUser } from "../controllers/register.js";
import { getAccountInfo, updateAccountInfo, deleteAccountInfo } from "../controllers/myaccount.js";
import { getDashboardInfo } from "../controllers/dashboard.js";
import { getTeams, createTeam, updateTeam, deleteTeam, assignUserToTeam } from "../controllers/team.js";

const router = Express.Router();

router.get('/dashboard', getDashboardInfo);

router.get('/projects', getProjects);
router.get('/projects/team/:teamId', getProjectsByTeam);
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

router.get('/tasks', getTasks);
router.get('/tasks/project/:projectId', getTasksByProject);
router.get('/tasks/team/:teamId', getTasksByTeam);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

router.get('/chat', getChat);

router.get('/myaccount', getAccountInfo);
router.put('/myaccount', updateAccountInfo);
router.delete('/myaccount', deleteAccountInfo);

router.get('/team', getTeams);
router.post('/team', createTeam);
router.post('/team/:teamId/user/:userId', assignUserToTeam);
router.put('/team/:teamId', updateTeam);
router.delete('/team/:teamId', deleteTeam);

router.post('/login', loginUser);

router.post('/register', registerUser);


export default router;