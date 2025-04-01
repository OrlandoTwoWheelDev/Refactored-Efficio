const pool = require('../db/Pool.cjs');
pool.connect();
require('dotenv').config();
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate.cjs')

const {
  getAllProjects,
  getProjectsByUserId,
  getProjectsByTeams,
  getProjectsByUsers,
  getProjectsByUsername,
  createProjects,
  deleteExistingProject,
  updateExistingProject
} = require('../db/projects.cjs');

router.use(authenticate);

// Fetch all projects
router.get('/', async (req, res) => {
  try {
    const projects = await getAllProjects();
    res.json(projects);
  } catch (err) {
    throw err;
  }
});

router.get('/my-projects', authenticate, async (req, res) => {
  try {
      const user_id = req.user?.user_id; // Get user ID from token
      if (!user_id) {
          return res.status(400).json({ error: "User ID is missing" });
      }

      const userProjects = await getProjectsByUserId(user_id);
      res.json(userProjects);
  } catch (error) {
      console.error("Error fetching user projects:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});


// Fetch projects by team
router.get('/byTeam', async (req, res) => {
  try {
    const projectByTeam = await getProjectsByTeams();
    if (!projectByTeam || projectByTeam.length === 0) {
      return res.status(404).json({ error: "No project found for this Team" });
    };
    res.json(projectByTeam);
  } catch (err) {
    throw err;
  }
});

// Fetch projects by user ID (user_id)
router.get('/byusers/:user_id', async (req, res, next) => {
  const user_id = req.params.user_id;
  console.log("Received user_id:", user_id);
  try {
    const projectByUser = await getProjectsByUsers(user_id.trim());
    if (!projectByUser || projectByUser.length === 0) {
      return res.status(404).json({ error: "No project found for this user!" });
    }
    res.json(projectByUser);
  } catch (err) {
    next(err);
  }
});



router.get('/byusername/:username', authenticate, async (req, res) => {
  try {
    const username = req.params.username;
    console.log("Authenticated user:", req.user);  // Add this log

    const projects = await getProjectsByUsername(username);
    if (projects) {
      res.status(200).json(projects);
    } else {
      res.status(404).json({ error: 'No projects found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching projects' });
  }
});
;


router.post("/create-new-project", authenticate, async (req, res) => {
  console.log("Decoded User:", req.user); // Log to check if `user_id` exists
  console.log("User ID from req.user:", req.user?.user_id);
  console.log("Request Body:", req.body);

  const { project_name, status, start_date, end_date, description } = req.body;
  const user_id = req.user?.user_id; // Extract ID

  if (!user_id) {
    return res.status(400).json({ error: "User ID is missing" });
  }

  try {
    const newProject = await createProjects(project_name, description, status, start_date, end_date, user_id);
    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Delete a project by ID
router.delete('/delete-project/:project_id', async (req, res, next) => {
  const { project_id } = req.params;
  console.log("Deleting Project:", project_id);
  try {
    const deletedProject = await deleteExistingProject(project_id);

    if (!deletedProject) {
      return res.status(404).json({ error: "Project not found!" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Update project details
router.patch('/update/:projectId', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const updates = req.body;

    if (!Object.keys(updates).length) {
      return res.status(400).json({ error: "No fields provided for update." });
    }

    const updatedProject = await updateExistingProject(projectId, updates);
    res.status(200).json({ message: "Project updated successfully!", project: updatedProject });
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

module.exports = router;
